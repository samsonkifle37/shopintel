import { PrismaClient } from "@prisma/client";

export class TrackerService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(shopId: string) {
    const items = await this.prisma.trackedEntity.findMany({
      where: { shopId, isActive: true },
      orderBy: { updatedAt: "desc" }
    });

    return { items };
  }

  async create(shopId: string, payload: unknown) {
    const data = payload as {
      entityType: string;
      entityId: string;
      label: string;
      alertConfigJson: string;
    };

    return this.prisma.trackedEntity.create({
      data: {
        shopId,
        entityType: data.entityType,
        entityId: data.entityId,
        label: data.label,
        alertConfigJson: data.alertConfigJson
      }
    });
  }
}
