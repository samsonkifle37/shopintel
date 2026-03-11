import { FastifyInstance } from "fastify";

export async function reportRoutes(app: FastifyInstance) {
  app.get("/api/v1/reports", async (request) => {
    return app.services.reports.list(request.tenant.shopId);
  });
}
