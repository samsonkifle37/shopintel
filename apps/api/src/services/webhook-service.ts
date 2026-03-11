import { createHash } from "crypto";
import { PrismaClient } from "@prisma/client";
import { syncQueue } from "../lib/queue";
import { JobName } from "@spi/shared/jobs";

type HandleWebhookInput = {
  topic: string;
  headers: Record<string, unknown>;
  payload: unknown;
};

export class WebhookService {
  constructor(private readonly prisma: PrismaClient) {}

  async handle(input: HandleWebhookInput) {
    const deliveryId = String(input.headers["x-shopify-webhook-id"] ?? "");
    const payloadHash = createHash("sha256").update(JSON.stringify(input.payload)).digest("hex");

    const existing = await this.prisma.webhookDelivery.findUnique({
      where: { deliveryId }
    });
    if (existing) return;

    await this.prisma.webhookDelivery.create({
      data: { deliveryId, topic: input.topic, payloadHash }
    });

    await syncQueue.add(JobName.ReconcileWebhook, {
      deliveryId,
      topic: input.topic,
      payload: input.payload
    });
  }
}
