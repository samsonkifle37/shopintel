import { useEffect, useState } from "react";
import { DataFreshnessCard } from "../components/DataFreshnessCard";
import { ScorePill } from "../components/ScorePill";
import { creators } from "../data/intelligenceMock";
import { apiUrl } from "../lib/api";

type TikTokConnectionState = {
  status: "ENABLED" | "PENDING" | "ERROR" | "DISABLED";
  lastSync: string | null;
  tokenExpiresAt: string | null;
  reconnectRequired: boolean;
  dataFreshnessMinutes: number | null;
  dataMode: "live" | "demo" | "estimated";
  featureFlags?: {
    tiktokAuthEnabled: boolean;
    tiktokWebhooksEnabled: boolean;
    tiktokContentConnectorEnabled: boolean;
    tiktokCompetitorResearchEnabled: boolean;
  };
};

type TikTokIntelligencePayload = {
  dataMode: "live" | "demo";
  topProducts: string[];
  topCreators: string[];
  risingShops: string[];
};

type TikTokDiagnostics = {
  connectionStatus: string;
  tokenStatus: string;
  tokenExpiry: string | null;
  lastSyncTime: string | null;
  lastWebhookTime: string | null;
  lastSyncResult: string;
  lastError: string | null;
  importedProductCount: number;
  importedOrderCount: number;
};

export function TikTokIntelligencePage() {
  const [connection, setConnection] = useState<TikTokConnectionState>({
    status: "DISABLED",
    lastSync: null,
    tokenExpiresAt: null,
    reconnectRequired: false,
    dataFreshnessMinutes: null,
    dataMode: "demo"
  });
  const [intelligence, setIntelligence] = useState<TikTokIntelligencePayload>({
    dataMode: "demo",
    topProducts: ["Ice Silk Posture Tee", "Magnetic Meal Prep Set"],
    topCreators: creators.map((creator) => creator[0]).filter((name): name is string => Boolean(name)),
    risingShops: ["VibeKitchenLive"]
  });
  const [diagnostics, setDiagnostics] = useState<TikTokDiagnostics>({
    connectionStatus: "DISABLED",
    tokenStatus: "missing",
    tokenExpiry: null,
    lastSyncTime: null,
    lastWebhookTime: null,
    lastSyncResult: "N/A",
    lastError: null,
    importedProductCount: 0,
    importedOrderCount: 0
  });

  useEffect(() => {
    let mounted = true;
    fetch(apiUrl("/api/v1/tiktok/connection"))
      .then((response) => response.json())
      .then((data: TikTokConnectionState) => {
        if (!mounted) return;
        setConnection(data);
      })
      .catch(() => {
        if (!mounted) return;
        setConnection((previous) => ({ ...previous, dataMode: "demo" }));
      });

    fetch(apiUrl("/api/v1/tiktok-intelligence"))
      .then((response) => response.json())
      .then((data: TikTokIntelligencePayload) => {
        if (!mounted) return;
        setIntelligence(data);
      })
      .catch(() => {
        if (!mounted) return;
      });

    fetch(apiUrl("/api/v1/tiktok/diagnostics"))
      .then((response) => response.json())
      .then((data: TikTokDiagnostics) => {
        if (!mounted) return;
        setDiagnostics(data);
      })
      .catch(() => {
        if (!mounted) return;
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function connectTikTok() {
    const response = await fetch(apiUrl("/api/v1/tiktok/connect"), { method: "POST" });
    const data = (await response.json()) as { authUrl?: string };
    if (data.authUrl) window.location.href = data.authUrl;
  }

  async function syncNow() {
    await fetch(apiUrl("/api/v1/tiktok/sync-now"), { method: "POST" });
  }

  async function reconnect() {
    const response = await fetch(apiUrl("/api/v1/tiktok/reconnect"), { method: "POST" });
    const data = (await response.json()) as { authUrl?: string };
    if (data.authUrl) window.location.href = data.authUrl;
  }

  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">TikTok Shop connection status</span>
          <div className="chip-row">
            <span className="chip">Status: {connection.status}</span>
            <span className="chip">Data mode: {connection.dataMode}</span>
            <span className="chip">Token: {connection.tokenExpiresAt ? "valid" : "missing"}</span>
            <span className="chip">Freshness: {connection.dataFreshnessMinutes ?? "-"} min</span>
          </div>
        </div>
        <div className="muted" style={{ marginBottom: 10 }}>
          Last sync: {connection.lastSync ?? "never"} | Reconnect required: {connection.reconnectRequired ? "yes" : "no"}
        </div>
        <div className="chip-row" style={{ marginBottom: 10 }}>
          <span className="chip">Auth flag: {String(connection.featureFlags?.tiktokAuthEnabled ?? true)}</span>
          <span className="chip">Webhooks flag: {String(connection.featureFlags?.tiktokWebhooksEnabled ?? true)}</span>
          <span className="chip">Content flag: {String(connection.featureFlags?.tiktokContentConnectorEnabled ?? true)}</span>
          <span className="chip">Competitor flag: {String(connection.featureFlags?.tiktokCompetitorResearchEnabled ?? false)}</span>
        </div>
        <div className="action-row">
          <button className="action-btn primary" onClick={connectTikTok}>
            Connect TikTok Shop
          </button>
          <button className="action-btn" onClick={syncNow}>
            Sync now
          </button>
          <button className="action-btn" onClick={reconnect}>
            Reconnect
          </button>
        </div>
      </div>

      <div className="section-grid-2">
        <DataFreshnessCard
          label="TikTok data freshness"
          lastSync={connection.lastSync}
          freshnessMinutes={connection.dataFreshnessMinutes}
          mode={connection.dataMode}
        />
        <div className="card card-pad">
          <div className="card-head">
            <span className="card-title">TikTok diagnostics</span>
            <span className="chip">Live pipeline telemetry</span>
          </div>
          <div className="dense-table-wrap">
            <table className="dense-table">
              <tbody>
                <tr>
                  <td>Connection status</td>
                  <td>{diagnostics.connectionStatus}</td>
                </tr>
                <tr>
                  <td>Token status</td>
                  <td>{diagnostics.tokenStatus}</td>
                </tr>
                <tr>
                  <td>Token expiry</td>
                  <td>{diagnostics.tokenExpiry ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Last sync time</td>
                  <td>{diagnostics.lastSyncTime ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Last webhook time</td>
                  <td>{diagnostics.lastWebhookTime ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Last sync result</td>
                  <td>{diagnostics.lastSyncResult}</td>
                </tr>
                <tr>
                  <td>Last error</td>
                  <td>{diagnostics.lastError ?? "None"}</td>
                </tr>
                <tr>
                  <td>Imported product count</td>
                  <td>{diagnostics.importedProductCount}</td>
                </tr>
                <tr>
                  <td>Imported order count</td>
                  <td>{diagnostics.importedOrderCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="section-grid-3">
        <div className="card card-pad">
          <div className="card-head">
            <span className="card-title">Top products</span>
            <span className="chip">Data: {intelligence.dataMode}</span>
          </div>
          <div className="rank-list">
            {intelligence.topProducts.map((product, index) => (
              <div className="rank-row" key={product}>
                  <div className="thumb" />
                  <div>{product}</div>
                  <ScorePill score={92 - index * 6} />
                  <button className="action-btn">Track</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <span className="card-title">Top creators</span>
            <span className="chip">Data: {intelligence.dataMode}</span>
          </div>
          <div className="rank-list">
            {intelligence.topCreators.map((creatorName, index) => {
              const fallback = creators.find((item) => item[0] === creatorName);
              return (
                <div className="rank-row" key={creatorName}>
                  <strong>{creatorName}</strong>
                  <span className="muted">{fallback?.[3] ?? "estimated"} engagement</span>
                  <ScorePill score={Number(fallback?.[7] ?? 80 - index * 5)} />
                  <button className="action-btn">Save</button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <span className="card-title">Winning hooks</span>
          </div>
          <div className="chip-row">
            <span className="chip">Data: estimated</span>
            <span className="chip">Problem-first opener + demo in 3s</span>
            <span className="chip">Price objection before CTA</span>
            <span className="chip">POV transformation framing</span>
          </div>
          <div className="action-row" style={{ marginTop: 10 }}>
            <button className="action-btn">View angles</button>
            <button className="action-btn primary">Tag winning hook</button>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Product-video mapping and engagement trends</span>
          <span className="chip">Data: {intelligence.dataMode}</span>
        </div>
        <div className="chip-row" style={{ marginBottom: 10 }}>
          {intelligence.risingShops.map((shop) => (
            <span className="chip" key={shop}>
              Rising shop: {shop}
            </span>
          ))}
        </div>
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Linked product</th>
                <th>Creator</th>
                <th>Views</th>
                <th>Engagement</th>
                <th>Sell-through signal</th>
                <th>Viral score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Office posture rescue routine</td>
                <td>Ice Silk Posture Tee</td>
                <td>FitWithNaya</td>
                <td>412K</td>
                <td>9.1%</td>
                <td>High</td>
                <td>
                  <ScorePill score={92} />
                </td>
                <td>
                  <span className="chip">High engagement / low conversion</span>
                </td>
              </tr>
              <tr>
                <td>Lunch prep in 20 seconds</td>
                <td>Magnetic Meal Prep Set</td>
                <td>HomeLabHack</td>
                <td>310K</td>
                <td>8.4%</td>
                <td>Medium-high</td>
                <td>
                  <ScorePill score={87} />
                </td>
                <td>
                  <span className="chip">Breakout</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
