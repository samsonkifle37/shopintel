import { PrismaClient } from "@prisma/client";
import { JobName } from "@spi/shared/jobs";
import { featureFlags } from "@spi/shared/feature-flags";
import { tiktokQueue } from "../../lib/queue";
import { TikTokAuthService } from "./tiktok-auth-service";
import { TikTokNormalizer } from "./tiktok-normalizer";
import { TikTokOrderSyncService } from "./tiktok-order-sync-service";
import { TikTokProductSyncService } from "./tiktok-product-sync-service";
import { TikTokShopSyncService } from "./tiktok-shop-sync-service";
import { TikTokTokenService } from "./tiktok-token-service";
import { TikTokWebhookService } from "./tiktok-webhook-service";

export class TikTokConnectorService {
  readonly normalizer = new TikTokNormalizer();
  readonly tokens: TikTokTokenService;
  readonly auth: TikTokAuthService;
  readonly shopSync: TikTokShopSyncService;
  readonly productSync: TikTokProductSyncService;
  readonly orderSync: TikTokOrderSyncService;
  readonly webhooks: TikTokWebhookService;

  constructor(private readonly prisma: PrismaClient) {
    this.tokens = new TikTokTokenService(prisma);
    this.auth = new TikTokAuthService(prisma, this.tokens);
    this.shopSync = new TikTokShopSyncService(prisma);
    this.productSync = new TikTokProductSyncService(prisma, this.normalizer);
    this.orderSync = new TikTokOrderSyncService(prisma, this.normalizer);
    this.webhooks = new TikTokWebhookService(prisma);
  }

  async getConnectionStatus(shopId: string) {
    const connection = await this.prisma.tikTokConnection.findUnique({ where: { shopId } });
    return {
      status: connection?.status ?? "DISABLED",
      lastSync: connection?.lastSyncAt ?? null,
      tokenExpiresAt: connection?.tokenExpiresAt ?? null,
      reconnectRequired: connection?.reconnectRequired ?? false,
      dataFreshnessMinutes: connection?.lastSyncAt ? Math.floor((Date.now() - connection.lastSyncAt.getTime()) / 60000) : null,
      dataMode: connection?.status === "ENABLED" ? "live" : "demo",
      featureFlags
    };
  }

  async getDiagnostics(shopId: string) {
    const [connection, lastWebhook, lastSyncRun, importedProductCount, syncAggregate] = await Promise.all([
      this.prisma.tikTokConnection.findUnique({ where: { shopId } }),
      this.prisma.tikTokWebhookEvent.findFirst({
        where: { shopId },
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.tikTokSyncRun.findFirst({
        where: { shopId },
        orderBy: { startedAt: "desc" }
      }),
      this.prisma.externalProduct.count({
        where: { shopId, channel: { type: "TIKTOK_SHOP" } }
      }),
      this.prisma.tikTokSyncRun.aggregate({
        where: { shopId, status: "COMPLETED" },
        _sum: { syncedOrders: true }
      })
    ]);

    return {
      connectionStatus: connection?.status ?? "DISABLED",
      tokenStatus: connection?.accessTokenCipher ? "present" : "missing",
      tokenExpiry: connection?.tokenExpiresAt ?? null,
      lastSyncTime: connection?.lastSyncAt ?? null,
      lastWebhookTime: lastWebhook?.createdAt ?? null,
      lastSyncResult: lastSyncRun?.status ?? "N/A",
      lastError: connection?.lastError ?? lastWebhook?.lastError ?? null,
      importedProductCount,
      importedOrderCount: syncAggregate._sum.syncedOrders ?? 0
    };
  }

  async connect(shopId: string) {
    return this.auth.createConnectUrl(shopId);
  }

  async callback(code: string, state: string) {
    const shopId = await this.auth.handleCallback(code, state);
    await this.enqueueInitialSync(shopId);
    return shopId;
  }

  async enqueueInitialSync(shopId: string) {
    console.info("tiktok.sync.enqueue", { shopId, job: JobName.TikTokInitialSync });
    await tiktokQueue.add(JobName.TikTokInitialSync, { shopId, trigger: "oauth" });
  }

  async enqueueIncrementalSync(shopId: string, trigger: "manual" | "scheduled" | "webhook") {
    const name = trigger === "scheduled" ? JobName.TikTokDailySync : JobName.TikTokIncrementalSync;
    console.info("tiktok.sync.enqueue", { shopId, job: name, trigger });
    await tiktokQueue.add(name, { shopId, trigger });
  }

  async markConnectedSync(shopId: string, products: number, orders: number, metrics: number) {
    await this.prisma.tikTokConnection.update({
      where: { shopId },
      data: { status: "ENABLED", lastSyncAt: new Date(), reconnectRequired: false }
    });
    await this.prisma.tikTokSyncRun.create({
      data: {
        shopId,
        runType: "INCREMENTAL",
        trigger: "connector",
        status: "COMPLETED",
        syncedProducts: products,
        syncedOrders: orders,
        syncedMetrics: metrics,
        finishedAt: new Date()
      }
    });
  }
}
