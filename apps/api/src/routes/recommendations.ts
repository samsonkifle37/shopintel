import { FastifyInstance } from "fastify";

export async function recommendationRoutes(app: FastifyInstance) {
  app.get("/api/v1/recommendations", async (request) => {
    return app.services.recommendations.list(request.tenant.shopId);
  });
}
