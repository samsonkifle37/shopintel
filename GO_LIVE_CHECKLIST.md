# GO LIVE CHECKLIST

## Mandatory gates (must all be true)

- [ ] Backend API deployed to `https://api.shopintel.example.com`
- [ ] Worker deployed and processing queue jobs
- [ ] Frontend deployed to `https://app.shopintel.example.com`
- [ ] TikTok callback URL updated in TikTok developer portal
- [ ] One real TikTok OAuth flow completed successfully
- [ ] One real TikTok sync run completed successfully
- [ ] One real TikTok webhook delivered and processed successfully

## Deployment verification

- [ ] `GET https://api.shopintel.example.com/health` returns 200
- [ ] `GET /api/v1/tiktok/connection` returns non-error response
- [ ] `GET /api/v1/tiktok/diagnostics` returns telemetry fields
- [ ] Frontend can call backend using `VITE_API_BASE_URL`
- [ ] No browser mixed-content/CORS issues

## Security verification

- [ ] No secrets committed to repository
- [ ] Production secrets stored only in platform secret manager
- [ ] `TOKEN_ENCRYPTION_KEY` set and rotated policy defined
- [ ] TikTok webhook signature validation enabled (`TIKTOK_WEBHOOK_SECRET`)
- [ ] API startup validation passes for all required TikTok env vars

## Data and pipeline verification

- [ ] `TikTokConnection` row created and token fields encrypted
- [ ] `TikTokSyncRun` rows are created for `sync-now` and scheduled sync
- [ ] Imported product count > 0 (if merchant has products)
- [ ] Imported order count > 0 (if merchant has orders)
- [ ] Webhook idempotency verified with same delivery ID replay
- [ ] Retry and dead-letter behavior verified with forced failures

## Observability verification

- [ ] Auth start logs visible (`tiktok.auth.start`)
- [ ] Callback success/failure logs visible
- [ ] Token decrypt success/failure logs visible
- [ ] Sync run start/end logs visible
- [ ] Webhook accepted/rejected logs visible

## Rollback readiness

- [ ] Previous stable backend release is available
- [ ] Feature flag fallback path documented
- [ ] Incident contact and rollback owner assigned
