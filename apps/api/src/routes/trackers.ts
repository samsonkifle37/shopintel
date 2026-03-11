import { FastifyInstance } from "fastify";

export async function trackerRoutes(app: FastifyInstance) {
  app.get("/api/v1/trackers", async (request) => {
    return app.services.trackers.list(request.tenant.shopId);
  });

  app.post("/api/v1/trackers", async (request) => {
    return app.services.trackers.create(request.tenant.shopId, request.body);
  });
}
