import { PrismaClient } from "@prisma/client";

export class IntelligenceService {
  constructor(private readonly prisma: PrismaClient) {}

  async discovery(shopId: string) {
    const tiktok = await this.prisma.externalProduct.findMany({
      where: {
        shopId,
        channel: { type: "TIKTOK_SHOP" }
      },
      orderBy: { trendScore: "desc" },
      take: 20
    });

    if (tiktok.length > 0) {
      return {
        dataMode: "live",
        items: tiktok.map((item) => ({
          id: item.externalProductId ?? item.id,
          title: item.title,
          channels: ["TIKTOK_SHOP"],
          trendScore: item.trendScore,
          competitionScore: item.competitionScore,
          revenue7d: 0
        }))
      };
    }

    return {
      dataMode: "demo",
      items: [
        {
          id: "P-1001",
          title: "Ice Silk Posture Tee",
          channels: ["SHOPIFY", "TIKTOK_SHOP"],
          trendScore: 93,
          competitionScore: 41,
          revenue7d: 94200
        },
        {
          id: "P-1002",
          title: "Magnetic Meal Prep Set",
          channels: ["TIKTOK_SHOP"],
          trendScore: 89,
          competitionScore: 38,
          revenue7d: 72880
        }
      ]
    };
  }

  async tiktokIntelligence(shopId: string) {
    const connection = await this.prisma.tikTokConnection.findUnique({ where: { shopId } });
    const topProducts = await this.prisma.externalProduct.findMany({
      where: { shopId, channel: { type: "TIKTOK_SHOP" } },
      orderBy: { trendScore: "desc" },
      take: 10
    });
    const topCreators = await this.prisma.creator.findMany({
      where: { shopId },
      orderBy: { trendScore: "desc" },
      take: 10
    });
    const risingShops = await this.prisma.commerceShop.findMany({
      where: { shopId, kind: "EXTERNAL_TIKTOK" },
      orderBy: { estimatedActivity: "desc" },
      take: 10
    });

    if (connection?.status === "ENABLED") {
      return {
        dataMode: "live",
        topProducts: topProducts.map((item) => item.title),
        topCreators: topCreators.map((item) => item.name),
        risingShops: risingShops.map((item) => item.displayName ?? item.handle)
      };
    }

    return {
      dataMode: "demo",
      topProducts: ["Ice Silk Posture Tee", "Magnetic Meal Prep Set"],
      topCreators: ["FitWithNaya", "HomeLabHack"],
      risingShops: ["VibeKitchenLive"]
    };
  }

  async shops(shopId: string) {
    const shops = await this.prisma.commerceShop.findMany({
      where: { shopId },
      orderBy: { estimatedActivity: "desc" },
      take: 50
    });

    if (shops.length > 0) {
      return {
        dataMode: "live",
        items: shops.map((shop) => ({
          name: shop.displayName ?? shop.handle,
          channel: shop.kind === "EXTERNAL_TIKTOK" ? "TIKTOK_SHOP" : "SHOPIFY",
          productCount: shop.productCount,
          activityScore: shop.estimatedActivity
        }))
      };
    }

    return {
      dataMode: "demo",
      items: [
        { name: "UrbanPeakGear", channel: "SHOPIFY", productCount: 420, activityScore: 82 },
        { name: "VibeKitchenLive", channel: "TIKTOK_SHOP", productCount: 190, activityScore: 90 }
      ]
    };
  }

  async creators(shopId: string) {
    const creators = await this.prisma.creator.findMany({
      where: { shopId },
      orderBy: { trendScore: "desc" },
      take: 50
    });
    if (creators.length > 0) {
      return {
        dataMode: "live",
        items: creators.map((creator) => ({
          name: creator.name,
          niche: creator.niche ?? "General",
          engagementRate: Number(creator.engagementRate),
          trendScore: creator.trendScore
        }))
      };
    }

    return {
      dataMode: "demo",
      items: [
        { name: "FitWithNaya", niche: "Fitness", engagementRate: 7.2, trendScore: 88 },
        { name: "HomeLabHack", niche: "Home", engagementRate: 6.8, trendScore: 77 }
      ]
    };
  }

  async ads(shopId: string) {
    const ads = await this.prisma.adCreative.findMany({
      where: { shopId },
      orderBy: { engagementScore: "desc" },
      take: 50
    });
    if (ads.length > 0) {
      return {
        dataMode: "live",
        items: ads.map((ad) => ({
          name: ad.creativeType ?? "Ad creative",
          hook: ad.hookText ?? "N/A",
          platform: ad.platform,
          trend: ad.trendStatus ?? "unknown"
        }))
      };
    }

    return {
      dataMode: "demo",
      items: [
        { name: "15s UGC Split Screen", hook: "Pain point first", platform: "TikTok", trend: "Rising" },
        { name: "Demo + Countdown", hook: "Price objection bust", platform: "TikTok", trend: "Breakout" }
      ]
    };
  }

  async sourcing(shopId: string) {
    const offers = await this.prisma.supplierOffer.findMany({
      where: { shopId },
      orderBy: [{ isRecommended: "desc" }, { score: "desc" }],
      take: 50,
      include: { supplier: true, externalProduct: true, product: true }
    });
    if (offers.length > 0) {
      return {
        dataMode: "live",
        offers: offers.map((offer) => ({
          product: offer.product?.title ?? offer.externalProduct?.title ?? offer.productTitle,
          supplier: offer.supplier.name,
          landedCost: Number(offer.landedCost),
          recommended: offer.isRecommended
        }))
      };
    }

    return {
      dataMode: "demo",
      offers: [
        { product: "Ice Silk Posture Tee", supplier: "Alibaba Direct #W-74", landedCost: 9.7, recommended: true },
        { product: "Magnetic Meal Prep Set", supplier: "CJdropshipping ZN-13", landedCost: 8.9, recommended: false }
      ]
    };
  }

  async alerts(shopId: string) {
    const alerts = await this.prisma.alert.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    if (alerts.length > 0) {
      return {
        dataMode: "live",
        items: alerts.map((alert) => ({
          type: alert.type,
          entity: alert.title,
          severity: alert.severity
        }))
      };
    }

    return {
      dataMode: "demo",
      items: [
        { type: "LOW_INVENTORY", entity: "Ice Silk Posture Tee / V2", severity: "CRITICAL" },
        { type: "CREATOR_BREAKOUT", entity: "FitWithNaya", severity: "HIGH" }
      ]
    };
  }
}
