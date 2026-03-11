import { FastifyInstance } from "fastify";

export async function intelligenceRoutes(app: FastifyInstance) {
  app.get("/api/v1/discovery", async (request) => app.services.intelligence.discovery(request.tenant.shopId));
  app.get("/api/v1/tiktok-intelligence", async (request) => app.services.intelligence.tiktokIntelligence(request.tenant.shopId));
  app.get("/api/v1/shops", async (request) => app.services.intelligence.shops(request.tenant.shopId));
  app.get("/api/v1/creators", async (request) => app.services.intelligence.creators(request.tenant.shopId));
  app.get("/api/v1/ads", async (request) => app.services.intelligence.ads(request.tenant.shopId));
  app.get("/api/v1/sourcing", async (request) => app.services.intelligence.sourcing(request.tenant.shopId));
  app.get("/api/v1/alerts", async (request) => app.services.intelligence.alerts(request.tenant.shopId));
}
