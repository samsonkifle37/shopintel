import { FastifyInstance } from "fastify";

export async function webhookRoutes(app: FastifyInstance) {
  app.post("/api/v1/webhooks/shopify", async (request, reply) => {
    await app.services.webhooks.handle({
      topic: String(request.headers["x-shopify-topic"] ?? "unknown"),
      headers: request.headers,
      payload: request.body
    });

    return reply.code(200).send({ ok: true });
  });
}
