import { PrismaClient } from "@prisma/client";

export class ReportService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(shopId: string) {
    const items = await this.prisma.reportRun.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return { items };
  }
}
