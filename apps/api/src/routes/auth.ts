import { FastifyInstance } from "fastify";
import { z } from "zod";
import { env } from "../config";

const installSchema = z.object({
  shop: z.string().min(1)
});

export async function authRoutes(app: FastifyInstance) {
  app.get("/api/v1/auth/install", async (request, reply) => {
    const { shop } = installSchema.parse(request.query);
    const redirect = await app.shopify.auth.begin({
      shop,
      callbackPath: "/api/v1/auth/callback",
      isOnline: false,
      rawRequest: request.raw,
      rawResponse: reply.raw
    });

    return reply.redirect(redirect);
  });

  app.get("/api/v1/auth/callback", async (request, reply) => {
    const callback = await app.shopify.auth.callback({
      rawRequest: request.raw,
      rawResponse: reply.raw
    });

    await app.services.shop.upsertShopFromSession(callback.session);
    await app.services.jobs.enqueueInitialSync(callback.session.shop);
    return reply.redirect(`${env.APP_BASE_URL}?shop=${callback.session.shop}`);
  });
}
