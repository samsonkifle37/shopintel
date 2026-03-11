import { PrismaClient } from "@prisma/client";

export class ShopService {
  constructor(private readonly prisma: PrismaClient) {}

  async upsertShopFromSession(session: { shop: string; accessToken?: string; scope?: string }) {
    return this.prisma.shop.upsert({
      where: { domain: session.shop },
      create: {
        domain: session.shop,
        offlineAccessToken: session.accessToken ?? "",
        scopes: session.scope ?? ""
      },
      update: {
        offlineAccessToken: session.accessToken ?? "",
        scopes: session.scope ?? ""
      }
    });
  }
}
