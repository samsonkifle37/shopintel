import { PrismaClient } from "@prisma/client";
import { TikTokClient } from "./tiktok-client";

export class TikTokShopSyncService {
  constructor(private readonly prisma: PrismaClient) {}

  async syncShop(shopId: string, accessToken: string) {
    const client = new TikTokClient(accessToken);
    const profile = await client.get<{ shop_cipher?: string; shop_name?: string; region?: string }>("/shop/202309/shop/get");

    return this.prisma.tikTokConnection.update({
      where: { shopId },
      data: {
        shopCipher: profile.shop_cipher ?? undefined,
        shopName: profile.shop_name ?? undefined,
        region: profile.region ?? undefined,
        lastSyncAt: new Date()
      }
    });
  }
}
