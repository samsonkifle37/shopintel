import "fastify";
import { shopifyApi } from "@shopify/shopify-api";
import { DashboardService } from "./services/dashboard-service";
import { JobService } from "./services/job-service";
import { BillingService } from "./services/billing-service";
import { ProductService } from "./services/product-service";
import { IntelligenceService } from "./services/intelligence-service";
import { RecommendationService } from "./services/recommendation-service";
import { ReportService } from "./services/report-service";
import { ShopService } from "./services/shop-service";
import { TikTokConnectorService } from "./services/tiktok/tiktok-connector-service";
import { TrackerService } from "./services/tracker-service";
import { WebhookService } from "./services/webhook-service";

declare module "fastify" {
  interface FastifyInstance {
    shopify: ReturnType<typeof shopifyApi>;
    services: {
      shop: ShopService;
      dashboard: DashboardService;
      intelligence: IntelligenceService;
      products: ProductService;
      trackers: TrackerService;
      recommendations: RecommendationService;
      reports: ReportService;
      tiktok: TikTokConnectorService;
      billing: BillingService;
      webhooks: WebhookService;
      jobs: JobService;
    };
  }

  interface FastifyRequest {
    tenant: {
      shopId: string;
    };
  }
}
