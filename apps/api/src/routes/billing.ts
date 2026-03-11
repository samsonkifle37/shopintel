import { FastifyInstance } from "fastify";

export async function billingRoutes(app: FastifyInstance) {
  app.post("/api/v1/billing/subscribe", async (request) => {
    return app.services.billing.subscribe(request.tenant.shopId, request.body);
  });
}
