import { PrismaClient } from "@prisma/client";
import { TikTokClient } from "./tiktok-client";
import { TikTokNormalizer } from "./tiktok-normalizer";

export class TikTokProductSyncService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly normalizer: TikTokNormalizer
  ) {}

  async syncProducts(shopId: string, channelId: string, accessToken: string) {
    const client = new TikTokClient(accessToken);
    const data = await client.get<{ products?: Array<{ id: string; title: string; image_url?: string; price?: string }> }>("/product/202309/products/search");
    const products = data.products ?? [];

    for (const raw of products) {
      const normalized = this.normalizer.normalizeProduct(raw);
      await this.prisma.externalProduct.upsert({
        where: {
          shopId_externalProductId: {
            shopId,
            externalProductId: normalized.externalProductId
          }
        },
        create: {
          shopId,
          channelId,
          externalProductId: normalized.externalProductId,
          title: normalized.title,
          thumbnailUrl: normalized.thumbnailUrl,
          price: normalized.price,
          metadataJson: JSON.stringify({ source: "tiktok_shop" }),
          lastObservedAt: new Date()
        },
        update: {
          title: normalized.title,
          thumbnailUrl: normalized.thumbnailUrl,
          price: normalized.price,
          lastObservedAt: new Date()
        }
      });
    }

    return products.length;
  }
}
