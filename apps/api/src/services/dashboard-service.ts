import { PrismaClient } from "@prisma/client";

export class DashboardService {
  constructor(private readonly prisma: PrismaClient) {}

  async getOverview(shopId: string) {
    const latest = await this.prisma.kpiSnapshot.findFirst({
      where: { shopId },
      orderBy: { snapshotDate: "desc" }
    });

    const recommendations = await this.prisma.recommendation.findMany({
      where: { shopId, status: "OPEN" },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 3
    });

    return { kpis: latest, recommendations };
  }
}
