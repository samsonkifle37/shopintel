import { Queue, Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { JobName } from "@spi/shared/jobs";
import { createDecipheriv, createCipheriv, createHash, randomBytes } from "crypto";

const connection = {
  url: process.env.REDIS_URL ?? "redis://localhost:6379"
};
const prisma = new PrismaClient();
const tiktokSyncQueue = new Queue("tiktok-sync", { connection });
const webhookRetryQueue = new Queue(JobName.TikTokWebhookRetry, { connection });
const webhookDeadLetterQueue = new Queue(JobName.TikTokWebhookDeadLetter, { connection });

const encryptionKey = createHash("sha256")
  .update(process.env.TOKEN_ENCRYPTION_KEY ?? "dev-only-key")
  .digest();

function decryptSecret(payload: string) {
  const [ivRaw, tagRaw, encryptedRaw] = payload.split(".");
  if (!ivRaw || !tagRaw || !encryptedRaw) {
    throw new Error("Invalid encrypted payload");
  }
  const iv = Buffer.from(ivRaw, "base64");
  const tag = Buffer.from(tagRaw, "base64");
  const encrypted = Buffer.from(encryptedRaw, "base64");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

async function refreshTokenIfNeeded(shopId: string) {
  const connectionRecord = await prisma.tikTokConnection.findUnique({ where: { shopId } });
  if (!connectionRecord?.accessTokenCipher) throw new Error("TikTok connection missing");
  if (!connectionRecord.tokenExpiresAt || connectionRecord.tokenExpiresAt.getTime() > Date.now() + 5 * 60 * 1000) {
    return decryptSecret(connectionRecord.accessTokenCipher);
  }
  if (!connectionRecord.refreshTokenCipher) throw new Error("TikTok refresh token missing");

  const refreshPayload = {
    app_key: process.env.TIKTOK_APP_KEY,
    app_secret: process.env.TIKTOK_APP_SECRET,
    grant_type: "refresh_token",
    refresh_token: decryptSecret(connectionRecord.refreshTokenCipher)
  };

  const refreshPath = process.env.TIKTOK_SHOP_REFRESH_PATH ?? "/authorization/202309/refresh_token";
  const apiBase = process.env.TIKTOK_API_BASE_URL ?? process.env.TIKTOK_SHOP_API_BASE_URL ?? "https://open-api.tiktokglobalshop.com";
  const response = await fetch(new URL(refreshPath, apiBase), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(refreshPayload)
  });
  const json = (await response.json()) as {
    code: number;
    message?: string;
    data?: { access_token: string; refresh_token?: string; access_token_expire_in?: number; refresh_token_expire_in?: number };
  };
  if (!response.ok || json.code !== 0 || !json.data?.access_token) {
    await prisma.tikTokConnection.update({
      where: { shopId },
      data: { status: "ERROR", reconnectRequired: true, lastError: json.message ?? "refresh failed" }
    });
    throw new Error(json.message ?? "TikTok refresh failed");
  }

  await prisma.tikTokConnection.update({
    where: { shopId },
    data: {
      accessTokenCipher: encryptSecret(json.data.access_token),
      refreshTokenCipher: json.data.refresh_token ? encryptSecret(json.data.refresh_token) : null,
      tokenExpiresAt: json.data.access_token_expire_in ? new Date(Date.now() + json.data.access_token_expire_in * 1000) : null,
      refreshExpiresAt: json.data.refresh_token_expire_in ? new Date(Date.now() + json.data.refresh_token_expire_in * 1000) : null,
      tokenLastRotatedAt: new Date(),
      reconnectRequired: false,
      status: "ENABLED"
    }
  });
  return json.data.access_token;
}

async function syncTikTok(shopId: string, runType: "INITIAL" | "INCREMENTAL" | "DAILY", trigger: string) {
  console.info("tiktok.sync.run.start", { shopId, runType, trigger });
  const run = await prisma.tikTokSyncRun.create({
    data: { shopId, runType, trigger, status: "RUNNING" }
  });
  try {
    const accessToken = await refreshTokenIfNeeded(shopId);
    const apiBase = process.env.TIKTOK_API_BASE_URL ?? process.env.TIKTOK_SHOP_API_BASE_URL ?? "https://open-api.tiktokglobalshop.com";
    const channel = await prisma.channel.upsert({
      where: { shopId_type_accountRef: { shopId, type: "TIKTOK_SHOP", accountRef: "primary" } },
      create: { shopId, type: "TIKTOK_SHOP", accountRef: "primary", status: "ENABLED" },
      update: { status: "ENABLED" }
    });

    const shopRes = await fetch(new URL("/shop/202309/shop/get", apiBase), {
      headers: { "x-tts-access-token": accessToken }
    });
    const shopJson = (await shopRes.json()) as { data?: { shop_cipher?: string; shop_name?: string; region?: string } };
    const shopInfo = shopJson.data ?? {};
    await prisma.commerceShop.upsert({
      where: { id: `tiktok-${shopId}` },
      create: {
        id: `tiktok-${shopId}`,
        shopId,
        channelId: channel.id,
        kind: "EXTERNAL_TIKTOK",
        handle: shopInfo.shop_name ?? "tiktok-shop",
        displayName: shopInfo.shop_name ?? "TikTok Shop",
        externalShopId: shopInfo.shop_cipher ?? null,
        countryCode: shopInfo.region ?? null
      },
      update: {
        channelId: channel.id,
        handle: shopInfo.shop_name ?? "tiktok-shop",
        displayName: shopInfo.shop_name ?? "TikTok Shop",
        externalShopId: shopInfo.shop_cipher ?? null,
        countryCode: shopInfo.region ?? null
      }
    });

    const productsRes = await fetch(new URL("/product/202309/products/search", apiBase), {
      headers: { "x-tts-access-token": accessToken }
    });
    const productsJson = (await productsRes.json()) as {
      data?: { products?: Array<{ id: string; title: string; image_url?: string; price?: string }> };
    };
    const products = productsJson.data?.products ?? [];
    for (const product of products) {
      await prisma.externalProduct.upsert({
        where: { shopId_externalProductId: { shopId, externalProductId: product.id } },
        create: {
          shopId,
          channelId: channel.id,
          externalProductId: product.id,
          title: product.title,
          thumbnailUrl: product.image_url ?? null,
          price: Number(product.price ?? "0"),
          metadataJson: JSON.stringify({ source: "tiktok_shop" }),
          lastObservedAt: new Date()
        },
        update: {
          title: product.title,
          thumbnailUrl: product.image_url ?? null,
          price: Number(product.price ?? "0"),
          lastObservedAt: new Date()
        }
      });
    }

    const ordersRes = await fetch(new URL("/order/202309/orders/search", apiBase), {
      headers: { "x-tts-access-token": accessToken }
    });
    const ordersJson = (await ordersRes.json()) as {
      data?: { orders?: Array<{ id: string; total_amount?: string }> };
    };
    const orders = ordersJson.data?.orders ?? [];
    const orderRevenue = orders.reduce((acc, item) => acc + Number(item.total_amount ?? "0"), 0);

    await prisma.tikTokConnection.update({
      where: { shopId },
      data: {
        status: "ENABLED",
        reconnectRequired: false,
        lastSyncAt: new Date(),
        lastFullSyncAt: runType === "INITIAL" ? new Date() : null,
        lastError: null,
        metadataJson: JSON.stringify({ lastOrderRevenue: orderRevenue })
      }
    });
    await prisma.channel.update({
      where: { id: channel.id },
      data: { lastSyncAt: new Date(), status: "ENABLED" }
    });
    await prisma.tikTokSyncRun.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        syncedProducts: products.length,
        syncedOrders: orders.length,
        syncedMetrics: 1,
        finishedAt: new Date()
      }
    });
    console.info("tiktok.sync.run.end", { shopId, runType, trigger, status: "COMPLETED" });
  } catch (error) {
    await prisma.tikTokConnection.update({
      where: { shopId },
      data: { status: "ERROR", lastError: error instanceof Error ? error.message : "sync failed" }
    });
    await prisma.tikTokSyncRun.update({
      where: { id: run.id },
      data: { status: "FAILED", errorMessage: error instanceof Error ? error.message : "sync failed", finishedAt: new Date() }
    });
    console.error("tiktok.sync.run.end", {
      shopId,
      runType,
      trigger,
      status: "FAILED",
      error: error instanceof Error ? error.message : "sync failed"
    });
    throw error;
  }
}

const shopWorker = new Worker(
  JobName.SyncShop,
  async (job) => {
    const shopId = String((job.data as { shopId?: string }).shopId ?? "dev-shop");
    await prisma.auditLog.create({
      data: {
        shopId,
        actorType: "SYSTEM",
        action: `job.${job.name}`,
        metadataJson: JSON.stringify(job.data)
      }
    });
  },
  { connection }
);

const tiktokWorker = new Worker(
  "tiktok-sync",
  async (job) => {
    const data = job.data as { shopId: string; trigger?: string; webhookEventId?: string };
    if (job.name === JobName.TikTokInitialSync) {
      await syncTikTok(data.shopId, "INITIAL", data.trigger ?? "oauth");
      return;
    }
    if (job.name === JobName.TikTokIncrementalSync) {
      await syncTikTok(data.shopId, "INCREMENTAL", data.trigger ?? "manual");
      return;
    }
    if (job.name === JobName.TikTokDailySync) {
      await syncTikTok(data.shopId, "DAILY", data.trigger ?? "scheduled");
      return;
    }
    if (job.name === JobName.TikTokWebhookRefresh && data.webhookEventId) {
      await prisma.tikTokWebhookEvent.update({
        where: { id: data.webhookEventId },
        data: { processStatus: "PROCESSING", attempts: { increment: 1 } }
      });
      await syncTikTok(data.shopId, "INCREMENTAL", "webhook");
      await prisma.tikTokWebhookEvent.update({
        where: { id: data.webhookEventId },
        data: { processStatus: "COMPLETED", lastError: null }
      });
    }
  },
  { connection }
);

const webhookRetryWorker = new Worker(
  JobName.TikTokWebhookRetry,
  async (job) => {
    const data = job.data as { webhookEventId: string };
    const event = await prisma.tikTokWebhookEvent.findUnique({ where: { id: data.webhookEventId } });
    if (!event) return;
    await prisma.tikTokWebhookEvent.update({
      where: { id: event.id },
      data: { processStatus: "PENDING" }
    });
    await tiktokSyncQueue.add(JobName.TikTokWebhookRefresh, {
      shopId: event.shopId,
      webhookEventId: event.id,
      trigger: "webhook-retry"
    });
  },
  { connection }
);

const deadLetterWorker = new Worker(
  JobName.TikTokWebhookDeadLetter,
  async (job) => {
    const data = job.data as { webhookEventId: string; reason: string };
    await prisma.tikTokWebhookEvent.update({
      where: { id: data.webhookEventId },
      data: { processStatus: "DEAD_LETTER", lastError: data.reason }
    });
  },
  { connection }
);

for (const worker of [shopWorker, tiktokWorker, webhookRetryWorker, deadLetterWorker]) {
  worker.on("completed", (job) => {
    console.log(`completed ${job.name}:${job.id}`);
  });
  worker.on("failed", async (job, err) => {
    if (job?.name === JobName.TikTokWebhookRefresh) {
      const data = job.data as { webhookEventId?: string };
      if (data.webhookEventId) {
        const event = await prisma.tikTokWebhookEvent.findUnique({ where: { id: data.webhookEventId } });
        const attempts = (event?.attempts ?? 0) + 1;
        const deadLetter = attempts >= 5;
        await prisma.tikTokWebhookEvent.update({
          where: { id: data.webhookEventId },
          data: {
            attempts,
            processStatus: deadLetter ? "DEAD_LETTER" : "RETRYING",
            nextAttemptAt: deadLetter ? null : new Date(Date.now() + 60_000),
            lastError: err?.message ?? "webhook refresh failed"
          }
        });
        if (deadLetter) {
          await webhookDeadLetterQueue.add(JobName.TikTokWebhookDeadLetter, {
            webhookEventId: data.webhookEventId,
            reason: err?.message ?? "webhook refresh failed"
          });
        } else {
          await webhookRetryQueue.add(
            JobName.TikTokWebhookRetry,
            { webhookEventId: data.webhookEventId },
            { delay: 60_000 }
          );
        }
      }
    }
    console.error(`failed ${job?.name}:${job?.id}`, err?.message);
  });
}
