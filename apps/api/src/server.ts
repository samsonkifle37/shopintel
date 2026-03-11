import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { validateTikTokEnv } from "./config";
import { appPlugin } from "./plugins/app";
import { tenantPlugin } from "./plugins/tenant";
import { authRoutes } from "./routes/auth";
import { billingRoutes } from "./routes/billing";
import { dashboardRoutes } from "./routes/dashboard";
import { healthRoutes } from "./routes/health";
import { intelligenceRoutes } from "./routes/intelligence";
import { productRoutes } from "./routes/products";
import { recommendationRoutes } from "./routes/recommendations";
import { reportRoutes } from "./routes/reports";
import { tiktokRoutes } from "./routes/tiktok";
import { trackerRoutes } from "./routes/trackers";
import { webhookRoutes } from "./routes/webhooks";

const app = Fastify({ logger: true });

async function start() {
  try {
    validateTikTokEnv(true);
    app.log.info("startup.validation.tiktok.ok");
  } catch (error) {
    app.log.error({ err: error }, "startup.validation.tiktok.failed");
    throw error;
  }

  await app.register(cors, { origin: true, credentials: true });
  await app.register(sensible);
  await app.register(appPlugin);
  await app.register(tenantPlugin);

  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(webhookRoutes);
  await app.register(dashboardRoutes);
  await app.register(intelligenceRoutes);
  await app.register(productRoutes);
  await app.register(trackerRoutes);
  await app.register(recommendationRoutes);
  await app.register(reportRoutes);
  await app.register(tiktokRoutes);
  await app.register(billingRoutes);

  await app.listen({ host: "0.0.0.0", port: 3001 });
}

start().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
