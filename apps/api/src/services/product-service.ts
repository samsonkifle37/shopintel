import { PrismaClient } from "@prisma/client";

export class ProductService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(shopId: string) {
    const items = await this.prisma.product.findMany({
      where: { shopId },
      orderBy: [{ opportunityScore: "desc" }, { totalRevenue: "desc" }],
      take: 50
    });

    return { items };
  }

  async detail(shopId: string, productId: string) {
    return this.prisma.product.findFirst({
      where: { shopId, id: productId },
      include: {
        variants: true,
        snapshots: {
          orderBy: { snapshotDate: "desc" },
          take: 30
        }
      }
    });
  }
}
