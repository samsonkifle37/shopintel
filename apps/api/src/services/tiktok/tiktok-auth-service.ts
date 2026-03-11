import { createHmac, timingSafeEqual } from "crypto";
import { PrismaClient } from "@prisma/client";
import { env } from "../../config";
import { TikTokTokenService } from "./tiktok-token-service";

type ConnectResult = {
  authUrl: string;
  state: string;
};

export class TikTokAuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly tokenService: TikTokTokenService
  ) {}

  createConnectUrl(shopId: string): ConnectResult {
    if (!env.TIKTOK_APP_KEY || !env.TIKTOK_APP_SECRET) {
      throw new Error("TikTok app credentials are not configured");
    }

    const statePayload = `${shopId}:${Date.now()}`;
    const sig = createHmac("sha256", env.SESSION_SECRET).update(statePayload).digest("hex");
    const state = Buffer.from(`${statePayload}:${sig}`).toString("base64url");
    const callbackUrl = env.TIKTOK_REDIRECT_URI;
    const authUrl = new URL("/api/v2/authorization", env.TIKTOK_SHOP_AUTH_URL);
    authUrl.searchParams.set("app_key", env.TIKTOK_APP_KEY);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("redirect_uri", callbackUrl);

    return { authUrl: authUrl.toString(), state };
  }

  async handleCallback(code: string, state: string) {
    const shopId = this.verifyState(state);
    await this.prisma.tikTokConnection.upsert({
      where: { shopId },
      create: {
        shopId,
        status: "PENDING"
      },
      update: {
        status: "PENDING",
        lastError: null
      }
    });
    await this.tokenService.exchangeAuthorizationCode(shopId, code);
    return shopId;
  }

  private verifyState(state: string) {
    const decoded = Buffer.from(state, "base64url").toString("utf8");
    const [shopId, issuedAtRaw, signature] = decoded.split(":");
    if (!shopId || !issuedAtRaw || !signature) throw new Error("Invalid state");
    const payload = `${shopId}:${issuedAtRaw}`;
    const expected = createHmac("sha256", env.SESSION_SECRET).update(payload).digest("hex");
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) throw new Error("State signature mismatch");
    return shopId;
  }
}
