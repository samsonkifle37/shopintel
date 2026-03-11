# TikTok Shop Live Ingestion Implementation

## Auth flow design

1. Merchant clicks `Connect TikTok Shop` from TikTok Intelligence page.
2. Backend `POST /api/v1/tiktok/connect` generates signed OAuth `state` and authorization URL.
3. Merchant authorizes via TikTok Shop official authorization page.
4. TikTok redirects to `GET /api/v1/tiktok/callback` with `code` and `state`.
5. Backend verifies state signature and exchanges code for token.
6. Access and refresh tokens are encrypted and persisted in `TikTokConnection`.
7. Initial sync job is enqueued.

## Required env vars

- `APP_BASE_URL`
- `TIKTOK_APP_KEY`
- `TIKTOK_APP_SECRET`
- `TIKTOK_REDIRECT_URI`
- `TIKTOK_API_BASE_URL`
- `TOKEN_ENCRYPTION_KEY`
- `TIKTOK_WEBHOOK_SECRET`

## DB schema changes

Added models:

- `TikTokConnection` for encrypted merchant token lifecycle and sync state
- `TikTokWebhookEvent` for idempotent webhook payload persistence and processing state
- `TikTokSyncRun` for operational sync run tracking and auditability

Updated models:

- `Shop` relation links to connection/events/sync runs
- `Channel` relation includes optional TikTok connection link
- `ExternalProduct` includes unique key for `shopId + externalProductId`

## Service classes

Added modular TikTok connector services under `apps/api/src/services/tiktok`:

- `tiktok-auth-service.ts`
- `tiktok-token-service.ts`
- `tiktok-client.ts`
- `tiktok-shop-sync-service.ts`
- `tiktok-product-sync-service.ts`
- `tiktok-order-sync-service.ts`
- `tiktok-webhook-service.ts`
- `tiktok-normalizer.ts`
- `tiktok-connector-service.ts` (orchestrator)

## Webhook handler

- Endpoint: `POST /api/v1/tiktok/webhooks`
- Signature handling: HMAC validation against `TIKTOK_SHOP_WEBHOOK_SECRET` when configured
- Idempotency: unique key `(shopId, deliveryId)` in `TikTokWebhookEvent`
- Retry and dead-letter: tracked with process states and BullMQ job flows

## Sync jobs

Job names added:

- `tiktok-initial-sync`
- `tiktok-incremental-sync`
- `tiktok-daily-sync`
- `tiktok-webhook-refresh`
- `tiktok-webhook-retry`
- `tiktok-webhook-dead-letter`

Worker logic:

- Refreshes tokens when expiry is near
- Syncs shop profile, products, and order summary metrics
- Updates channel and connection freshness timestamps
- Writes `TikTokSyncRun` audit records
- Handles webhook-triggered incremental refresh

## API routes

- `GET /api/v1/tiktok/connection`
- `GET /api/v1/tiktok/diagnostics`
- `POST /api/v1/tiktok/connect`
- `GET /api/v1/tiktok/callback`
- `POST /api/v1/tiktok/reconnect`
- `POST /api/v1/tiktok/sync-now`
- `POST /api/v1/tiktok/webhooks`

## UI connection screen

Implemented in `TikTokIntelligencePage`:

- status: connected/pending/failed/disabled
- last sync
- token status
- data freshness
- `Connect TikTok Shop`, `Sync now`, and `Reconnect` actions
- explicit data mode label: `live`, `estimated`, `demo`

## Feature flags

Added in `packages/shared/src/feature-flags.ts`:

- `tiktokAuthEnabled`
- `tiktokWebhooksEnabled`
- `tiktokContentConnectorEnabled`
- `tiktokCompetitorResearchEnabled` default `false`

## Migration plan from mock to live data

1. Enable TikTok auth/webhook flags in staging.
2. Deploy schema migration and regenerate Prisma client.
3. Keep UI in `demo` mode until `TikTokConnection.status === ENABLED`.
4. Run first merchant connection and validate initial sync run.
5. Enable webhook endpoint and monitor retries/dead-letter counts.
6. Switch page modules to read API responses instead of mock constants.
7. Backfill historical product/order snapshots via initial sync jobs.
8. Remove mock fallbacks per module once live coverage is stable.

Detailed dev verification steps and curl commands are in [TikTokDevChecklist.md](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/TikTokDevChecklist.md).
