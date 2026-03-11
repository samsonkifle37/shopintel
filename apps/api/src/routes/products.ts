import { FastifyInstance } from "fastify";

export async function productRoutes(app: FastifyInstance) {
  app.get("/api/v1/products", async (request) => {
    return app.services.products.list(request.tenant.shopId);
  });

  app.get("/api/v1/products/:productId", async (request) => {
    const productId = String((request.params as { productId: string }).productId);
    return app.services.products.detail(request.tenant.shopId, productId);
  });
}
