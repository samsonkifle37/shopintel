# TikTok Live Pipeline Dev Checklist

## Prerequisites

Set env vars:

- `APP_BASE_URL`
- `TIKTOK_APP_KEY`
- `TIKTOK_APP_SECRET`
- `TIKTOK_REDIRECT_URI`
- `TIKTOK_API_BASE_URL`
- `TOKEN_ENCRYPTION_KEY`
- `TIKTOK_WEBHOOK_SECRET`

## Startup validation

1. Start API.
2. Confirm no startup error `startup.validation.tiktok.failed`.
3. If missing vars, API should exit with a clear list of missing keys.

## Connection flow validation

### UI steps

1. Open TikTok Intelligence page.
2. Click `Connect TikTok Shop`.
3. Complete TikTok authorization.
4. Confirm callback redirects to `/tiktok-intelligence?...&connected=1`.

### API calls

```bash
curl -X GET "http://localhost:3001/api/v1/tiktok/connection" -H "x-shop-id: dev-shop"
curl -X GET "http://localhost:3001/api/v1/tiktok/diagnostics" -H "x-shop-id: dev-shop"
```

Expected:

- `status` = `ENABLED` or `PENDING` during flow
- non-null `tokenExpiry`
- non-null `lastSyncTime` after first sync

## Sync flow validation

```bash
curl -X POST "http://localhost:3001/api/v1/tiktok/sync-now" -H "x-shop-id: dev-shop"
curl -X POST "http://localhost:3001/api/v1/tiktok/sync-daily" -H "x-shop-id: dev-shop"
curl -X POST "http://localhost:3001/api/v1/tiktok/reconnect" -H "x-shop-id: dev-shop"
```

Then check:

```bash
curl -X GET "http://localhost:3001/api/v1/tiktok/diagnostics" -H "x-shop-id: dev-shop"
```

Expected:

- `lastSyncResult` updates to `COMPLETED` or `FAILED`
- `importedProductCount` and `importedOrderCount` increase when data exists

## Webhook flow validation

1. Build payload:

```bash
set PAYLOAD={"event":"ORDER_STATUS_CHANGE","order_id":"order_1001"}
```

2. Generate signature (`hex(hmac_sha256(payload, TIKTOK_WEBHOOK_SECRET))`).
3. Send webhook:

```bash
curl -X POST "http://localhost:3001/api/v1/tiktok/webhooks" ^
  -H "Content-Type: application/json" ^
  -H "x-shop-id: dev-shop" ^
  -H "x-tts-request-id: test-delivery-001" ^
  -H "x-tts-event-type: ORDER_STATUS_CHANGE" ^
  -H "x-tts-sign: <computed-signature>" ^
  -d "{\"event\":\"ORDER_STATUS_CHANGE\",\"order_id\":\"order_1001\"}"
```

4. Replay same delivery id to verify idempotency.
5. Send invalid signature to verify `401 signature_invalid`.

## Persistence validation (DB)

Check encrypted token persistence:

```sql
select shop_id, status, access_token_cipher, refresh_token_cipher, token_expires_at, last_sync_at
from "TikTokConnection";
```

Check webhook persistence:

```sql
select shop_id, delivery_id, event_type, signature_valid, process_status, attempts, last_error
from "TikTokWebhookEvent"
order by created_at desc;
```

Check sync jobs:

```sql
select shop_id, run_type, status, synced_products, synced_orders, synced_metrics, error_message
from "TikTokSyncRun"
order by started_at desc;
```

## Required logs to verify

- `tiktok.auth.start`
- `tiktok.auth.callback.success` / `tiktok.auth.callback.failure`
- `tiktok.token.decrypt.success` / `tiktok.token.decrypt.failure`
- `tiktok.webhook.accepted` / `tiktok.webhook.rejected.signature_invalid`
- worker sync logs showing start/end/failure transitions
