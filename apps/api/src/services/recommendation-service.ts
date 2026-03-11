import { PrismaClient } from "@prisma/client";

export class RecommendationService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(shopId: string) {
    const items = await this.prisma.recommendation.findMany({
      where: { shopId },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 50
    });

    return { items };
  }
}
