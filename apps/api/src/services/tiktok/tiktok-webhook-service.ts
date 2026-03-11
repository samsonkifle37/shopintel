import { createHash, createHmac, timingSafeEqual } from "crypto";
import { PrismaClient } from "@prisma/client";
import { env } from "../../config";
import { webhookDeadLetterQueue, webhookRetryQueue, tiktokQueue } from "../../lib/queue";
import { JobName } from "@spi/shared/jobs";

type IngestWebhookInput = {
  shopId: string;
  deliveryId: string;
  eventType: string;
  signature?: string;
  payload: unknown;
};

export class TikTokWebhookService {
  constructor(private readonly prisma: PrismaClient) {}

  async ingest(input: IngestWebhookInput) {
    const payloadJson = JSON.stringify(input.payload);
    const payloadHash = createHash("sha256").update(payloadJson).digest("hex");
    const signatureValid = this.verifySignature(payloadJson, input.signature);

    const event = await this.prisma.tikTokWebhookEvent.upsert({
      where: {
        shopId_deliveryId: {
          shopId: input.shopId,
          deliveryId: input.deliveryId
        }
      },
      create: {
        shopId: input.shopId,
        deliveryId: input.deliveryId,
        eventType: input.eventType,
        signature: input.signature,
        signatureValid,
        payloadJson,
        payloadHash,
        processStatus: "PENDING"
      },
      update: {
        signature: input.signature,
        signatureValid,
        payloadJson,
        payloadHash
      }
    });

    await tiktokQueue.add(
      JobName.TikTokWebhookRefresh,
      { shopId: input.shopId, webhookEventId: event.id, eventType: input.eventType },
      { attempts: 3, backoff: { type: "exponential", delay: 2_000 } }
    );

    return event;
  }

  async handleFailure(webhookEventId: string, reason: string) {
    const event = await this.prisma.tikTokWebhookEvent.update({
      where: { id: webhookEventId },
      data: {
        processStatus: "RETRYING",
        attempts: { increment: 1 },
        lastError: reason,
        nextAttemptAt: new Date(Date.now() + 60_000)
      }
    });

    if (event.attempts >= 5) {
      await this.prisma.tikTokWebhookEvent.update({
        where: { id: webhookEventId },
        data: { processStatus: "DEAD_LETTER" }
      });
      await webhookDeadLetterQueue.add(JobName.TikTokWebhookDeadLetter, { webhookEventId, reason });
      return;
    }

    await webhookRetryQueue.add(JobName.TikTokWebhookRetry, { webhookEventId }, { delay: 60_000 });
  }

  private verifySignature(payload: string, signature?: string) {
    if (!env.TIKTOK_WEBHOOK_SECRET) return false;
    if (!signature) return false;
    const expected = createHmac("sha256", env.TIKTOK_WEBHOOK_SECRET).update(payload).digest("hex");
    if (expected.length !== signature.length) return false;
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  }
}
