import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { z } from "zod";
import { env } from "../config";

const callbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1)
});

export async function tiktokRoutes(app: FastifyInstance) {
  app.get("/api/v1/tiktok/connection", async (request) => {
    return app.services.tiktok.getConnectionStatus(request.tenant.shopId);
  });

  app.get("/api/v1/tiktok/diagnostics", async (request) => {
    return app.services.tiktok.getDiagnostics(request.tenant.shopId);
  });

  app.post("/api/v1/tiktok/connect", async (request) => {
    app.log.info({ shopId: request.tenant.shopId }, "tiktok.auth.start");
    return app.services.tiktok.connect(request.tenant.shopId);
  });

  app.get("/api/v1/tiktok/callback", async (request, reply) => {
    try {
      const { code, state } = callbackSchema.parse(request.query);
      const shopId = await app.services.tiktok.callback(code, state);
      app.log.info({ shopId }, "tiktok.auth.callback.success");
      return reply.redirect(`${env.APP_BASE_URL}/tiktok-intelligence?shop=${shopId}&connected=1`);
    } catch (error) {
      app.log.error({ err: error }, "tiktok.auth.callback.failure");
      throw error;
    }
  });

  app.post("/api/v1/tiktok/reconnect", async (request) => {
    return app.services.tiktok.connect(request.tenant.shopId);
  });

  app.post("/api/v1/tiktok/sync-now", async (request) => {
    await app.services.tiktok.enqueueIncrementalSync(request.tenant.shopId, "manual");
    return { ok: true };
  });

  app.post("/api/v1/tiktok/sync-daily", async (request) => {
    await app.services.tiktok.enqueueIncrementalSync(request.tenant.shopId, "scheduled");
    return { ok: true };
  });

  app.post("/api/v1/tiktok/webhooks", async (request, reply) => {
    const headers = request.headers;
    const deliveryId = String(headers["x-tts-request-id"] ?? headers["x-tiktok-delivery-id"] ?? randomUUID());
    const eventType = String(headers["x-tts-event-type"] ?? "unknown");
    const signature = String(headers["x-tts-sign"] ?? headers["x-tiktok-signature"] ?? "");
    const shopId = String(headers["x-shop-id"] ?? request.tenant.shopId);
    const event = await app.services.tiktok.webhooks.ingest({
      shopId,
      deliveryId,
      eventType,
      signature,
      payload: request.body
    });
    if (env.TIKTOK_WEBHOOK_SECRET && !event.signatureValid) {
      app.log.warn({ shopId, deliveryId, eventType }, "tiktok.webhook.rejected.signature_invalid");
      return reply.code(401).send({ ok: false, reason: "signature_invalid" });
    }
    app.log.info({ shopId, deliveryId, eventType, signatureValid: event.signatureValid }, "tiktok.webhook.accepted");
    return { ok: true, signatureValid: event.signatureValid };
  });
}
