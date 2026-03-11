import { PrismaClient } from "@prisma/client";
import { env } from "../../config";
import { decryptSecret, encryptSecret } from "../../lib/crypto";

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  access_token_expire_in?: number;
  refresh_token_expire_in?: number;
  merchant_id?: string;
  shop_cipher?: string;
  shop_name?: string;
  region?: string;
};

export class TikTokTokenService {
  constructor(private readonly prisma: PrismaClient) {}

  async exchangeAuthorizationCode(shopId: string, code: string) {
    const payload = {
      app_key: env.TIKTOK_APP_KEY,
      app_secret: env.TIKTOK_APP_SECRET,
      auth_code: code,
      grant_type: "authorized_code"
    };

    const response = await fetch(new URL(env.TIKTOK_SHOP_TOKEN_PATH, env.TIKTOK_API_BASE_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = (await response.json()) as { code: number; message?: string; data?: TokenResponse };
    if (!response.ok || json.code !== 0 || !json.data) {
      throw new Error(json.message ?? `TikTok token exchange failed (${response.status})`);
    }

    return this.persistTokens(shopId, json.data);
  }

  async refreshIfNeeded(shopId: string) {
    const connection = await this.prisma.tikTokConnection.findUnique({ where: { shopId } });
    if (!connection?.refreshTokenCipher) return null;

    const expiresSoon = !connection.tokenExpiresAt || connection.tokenExpiresAt.getTime() < Date.now() + 5 * 60 * 1000;
    if (!expiresSoon) return connection;

    const refreshToken = decryptSecret(connection.refreshTokenCipher);
    const payload = {
      app_key: env.TIKTOK_APP_KEY,
      app_secret: env.TIKTOK_APP_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    };

    const response = await fetch(new URL(env.TIKTOK_SHOP_REFRESH_PATH, env.TIKTOK_API_BASE_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = (await response.json()) as { code: number; message?: string; data?: TokenResponse };
    if (!response.ok || json.code !== 0 || !json.data) {
      await this.prisma.tikTokConnection.update({
        where: { shopId },
        data: {
          reconnectRequired: true,
          status: "ERROR",
          lastError: json.message ?? "Refresh failed"
        }
      });
      throw new Error(json.message ?? "TikTok token refresh failed");
    }

    return this.persistTokens(shopId, json.data);
  }

  async getDecryptedAccessToken(shopId: string) {
    const connection = await this.refreshIfNeeded(shopId);
    if (!connection?.accessTokenCipher) throw new Error("TikTok not connected");
    try {
      const token = decryptSecret(connection.accessTokenCipher);
      console.info("tiktok.token.decrypt.success", { shopId });
      return token;
    } catch (error) {
      console.error("tiktok.token.decrypt.failure", { shopId, error: error instanceof Error ? error.message : "unknown" });
      throw error;
    }
  }

  private async persistTokens(shopId: string, data: TokenResponse) {
    const tokenExpiresAt = data.access_token_expire_in ? new Date(Date.now() + data.access_token_expire_in * 1000) : null;
    const refreshExpiresAt = data.refresh_token_expire_in ? new Date(Date.now() + data.refresh_token_expire_in * 1000) : null;

    return this.prisma.tikTokConnection.upsert({
      where: { shopId },
      create: {
        shopId,
        status: "ENABLED",
        merchantId: data.merchant_id ?? null,
        shopCipher: data.shop_cipher ?? null,
        shopName: data.shop_name ?? null,
        region: data.region ?? null,
        accessTokenCipher: encryptSecret(data.access_token),
        refreshTokenCipher: data.refresh_token ? encryptSecret(data.refresh_token) : null,
        tokenExpiresAt,
        refreshExpiresAt,
        tokenLastRotatedAt: new Date(),
        reconnectRequired: false,
        lastError: null
      },
      update: {
        status: "ENABLED",
        merchantId: data.merchant_id ?? null,
        shopCipher: data.shop_cipher ?? null,
        shopName: data.shop_name ?? null,
        region: data.region ?? null,
        accessTokenCipher: encryptSecret(data.access_token),
        refreshTokenCipher: data.refresh_token ? encryptSecret(data.refresh_token) : undefined,
        tokenExpiresAt,
        refreshExpiresAt,
        tokenLastRotatedAt: new Date(),
        reconnectRequired: false,
        lastError: null
      }
    });
  }
}
