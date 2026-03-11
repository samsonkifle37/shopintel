import "@shopify/shopify-api/adapters/node";
import { ApiVersion, LATEST_API_VERSION, shopifyApi } from "@shopify/shopify-api";
import { env } from "../config";

export const shopify: ReturnType<typeof shopifyApi> = shopifyApi({
  apiKey: env.SHOPIFY_API_KEY,
  apiSecretKey: env.SHOPIFY_API_SECRET,
  scopes: env.SHOPIFY_SCOPES.split(","),
  hostName: new URL(env.APP_BASE_URL).hostname,
  apiVersion: (env.SHOPIFY_API_VERSION as ApiVersion) || LATEST_API_VERSION,
  isEmbeddedApp: true
});
