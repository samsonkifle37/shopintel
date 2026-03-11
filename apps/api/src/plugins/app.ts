import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { shopify } from "../lib/shopify";
import { DashboardService } from "../services/dashboard-service";
import { JobService } from "../services/job-service";
import { BillingService } from "../services/billing-service";
import { IntelligenceService } from "../services/intelligence-service";
import { ProductService } from "../services/product-service";
import { RecommendationService } from "../services/recommendation-service";
import { ReportService } from "../services/report-service";
import { ShopService } from "../services/shop-service";
import { TikTokConnectorService } from "../services/tiktok/tiktok-connector-service";
import { TrackerService } from "../services/tracker-service";
import { WebhookService } from "../services/webhook-service";

export const appPlugin = fp(async (app) => {
  const prisma = new PrismaClient();

  app.decorate("shopify", shopify);
  app.decorate("services", {
    shop: new ShopService(prisma),
    dashboard: new DashboardService(prisma),
    intelligence: new IntelligenceService(prisma),
    products: new ProductService(prisma),
    trackers: new TrackerService(prisma),
    recommendations: new RecommendationService(prisma),
    reports: new ReportService(prisma),
    tiktok: new TikTokConnectorService(prisma),
    billing: new BillingService(),
    webhooks: new WebhookService(prisma),
    jobs: new JobService()
  });
});
