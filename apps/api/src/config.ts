import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_BASE_URL: z.string().url().optional(),
  APP_URL: z.string().url().optional(),
  SHOPIFY_API_KEY: z.string().min(1),
  SHOPIFY_API_SECRET: z.string().min(1),
  SHOPIFY_SCOPES: z.string().min(1),
  SHOPIFY_API_VERSION: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().min(32),
  TIKTOK_APP_KEY: z.string().optional(),
  TIKTOK_APP_SECRET: z.string().optional(),
  TIKTOK_REDIRECT_URI: z.string().url().optional(),
  TIKTOK_API_BASE_URL: z.string().url().optional(),
  TIKTOK_WEBHOOK_SECRET: z.string().optional(),
  TIKTOK_SHOP_AUTH_URL: z.string().url().default("https://auth.tiktok-shops.com"),
  TIKTOK_SHOP_API_BASE_URL: z.string().url().default("https://open-api.tiktokglobalshop.com"),
  TIKTOK_SHOP_TOKEN_PATH: z.string().default("/authorization/202309/token/get"),
  TIKTOK_SHOP_REFRESH_PATH: z.string().default("/authorization/202309/refresh_token"),
  TIKTOK_SHOP_WEBHOOK_SECRET: z.string().optional()
});

const rawEnv = envSchema.parse(process.env);

export const env = {
  ...rawEnv,
  APP_BASE_URL: rawEnv.APP_BASE_URL ?? rawEnv.APP_URL ?? "",
  TIKTOK_API_BASE_URL: rawEnv.TIKTOK_API_BASE_URL ?? rawEnv.TIKTOK_SHOP_API_BASE_URL,
  TIKTOK_WEBHOOK_SECRET: rawEnv.TIKTOK_WEBHOOK_SECRET ?? rawEnv.TIKTOK_SHOP_WEBHOOK_SECRET ?? "",
  TIKTOK_REDIRECT_URI:
    rawEnv.TIKTOK_REDIRECT_URI ??
    (rawEnv.APP_BASE_URL || rawEnv.APP_URL ? new URL("/api/v1/tiktok/callback", rawEnv.APP_BASE_URL ?? rawEnv.APP_URL).toString() : "")
};

if (!env.APP_BASE_URL) {
  throw new Error("APP_BASE_URL is required. Set APP_BASE_URL to your public application base URL.");
}

export function validateTikTokEnv(strict = true) {
  const missing: string[] = [];
  if (!env.APP_BASE_URL) missing.push("APP_BASE_URL");
  if (!env.TIKTOK_APP_KEY) missing.push("TIKTOK_APP_KEY");
  if (!env.TIKTOK_APP_SECRET) missing.push("TIKTOK_APP_SECRET");
  if (!env.TIKTOK_REDIRECT_URI) missing.push("TIKTOK_REDIRECT_URI");
  if (!env.TIKTOK_API_BASE_URL) missing.push("TIKTOK_API_BASE_URL");
  if (!env.TIKTOK_WEBHOOK_SECRET) missing.push("TIKTOK_WEBHOOK_SECRET");
  if (!env.TOKEN_ENCRYPTION_KEY) missing.push("TOKEN_ENCRYPTION_KEY");

  if (missing.length > 0 && strict) {
    throw new Error(`TikTok env configuration missing: ${missing.join(", ")}. Check your .env settings.`);
  }

  return {
    ok: missing.length === 0,
    missing
  };
}
