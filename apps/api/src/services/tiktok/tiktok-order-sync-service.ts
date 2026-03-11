import { PrismaClient } from "@prisma/client";
import { TikTokClient } from "./tiktok-client";
import { TikTokNormalizer } from "./tiktok-normalizer";

export class TikTokOrderSyncService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly normalizer: TikTokNormalizer
  ) {}

  async syncOrdersAndMetrics(shopId: string, channelId: string, accessToken: string) {
    const client = new TikTokClient(accessToken);
    const data = await client.get<{ orders?: Array<{ id: string; create_time?: number; total_amount?: string }> }>("/order/202309/orders/search");
    const orders = data.orders ?? [];
    let units = 0;
    let revenue = 0;

    for (const raw of orders) {
      const normalized = this.normalizer.normalizeOrder(raw);
      units += normalized.lineItems.reduce((acc, line) => acc + line.quantity, 0);
      revenue += normalized.totalAmount;
    }

    await this.prisma.importJob.create({
      data: {
        shopId,
        channelId,
        jobType: "TIKTOK_ORDER_SYNC",
        status: "COMPLETED",
        resultJson: JSON.stringify({
          orders: orders.length,
          units,
          revenue
        }),
        completedAt: new Date()
      }
    });

    return { orders: orders.length, units, revenue };
  }
}
