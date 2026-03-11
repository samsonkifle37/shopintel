import { FastifyInstance } from "fastify";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/api/v1/dashboard/overview", async (request) => {
    return app.services.dashboard.getOverview(request.tenant.shopId);
  });
}
