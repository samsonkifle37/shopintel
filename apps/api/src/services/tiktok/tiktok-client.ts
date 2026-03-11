import { env } from "../../config";

type TikTokApiResponse<T> = {
  code: number;
  message?: string;
  data?: T;
};

export class TikTokClient {
  constructor(private readonly accessToken: string) {}

  async get<T>(path: string, query: Record<string, string | number | undefined> = {}) {
    const url = new URL(path, env.TIKTOK_API_BASE_URL);
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-tts-access-token": this.accessToken
      }
    });

    if (!response.ok) throw new Error(`TikTok API GET failed: ${response.status}`);
    const payload = (await response.json()) as TikTokApiResponse<T>;
    if (payload.code !== 0 || !payload.data) throw new Error(payload.message ?? "TikTok API error");
    return payload.data;
  }
}
