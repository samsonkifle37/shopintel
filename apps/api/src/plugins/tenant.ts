import fp from "fastify-plugin";

export const tenantPlugin = fp(async (app) => {
  app.decorateRequest("tenant", { shopId: "" });

  app.addHook("preHandler", async (request) => {
    request.tenant = {
      shopId: String(request.headers["x-shop-id"] ?? "dev-shop")
    };
  });
});
