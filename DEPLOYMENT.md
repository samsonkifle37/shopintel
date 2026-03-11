# Split Deployment Runbook (Vercel + Persistent Backend)

## Monorepo paths

- Frontend app path: `apps/web`
- API app path: `apps/api`
- Worker app path: `apps/worker`

## Source of truth

- GitHub repository is the only source of truth for code and deployment config.
- Recommended branch model: `main` (production), `staging` (pre-prod), feature branches.

## 1. Repository readiness checks

1. `.gitignore` includes `.env*`, logs, and `.vercel`.
2. `.env.example` includes all required production env keys with placeholder values.
3. `README.md` references deployment and go-live docs.
4. Secret scan:
   - `rg "(AIza|sk_live_|xoxb-|AKIA|BEGIN PRIVATE KEY|ghp_)" -n`
   - `rg "([A-Za-z0-9]{32,})" -n --glob "!pnpm-lock.yaml"`
5. Confirm no real secrets in committed files.

## 2. Backend deployment package

Use [render.yaml](/c:/Users/samso/OneDrive/Desktop/Shopify/deploy/render.yaml) or equivalent platform setup:

- API service:
  - Build: `pnpm install --frozen-lockfile && pnpm --filter @spi/api build`
  - Start: `node apps/api/dist/server.js`
  - Health: `GET /health`
- Worker service:
  - Build: `pnpm install --frozen-lockfile && pnpm --filter @spi/worker build`
  - Start: `node apps/worker/dist/worker.js`
- Required infra:
  - Postgres (managed)
  - Redis (managed)

### Backend env vars (required)

- `NODE_ENV=production`
- `APP_BASE_URL=https://app.shopintel.example.com`
- `API_BASE_URL=https://api.shopintel.example.com`
- `DATABASE_URL=...`
- `REDIS_URL=...`
- `SHOPIFY_API_KEY=...`
- `SHOPIFY_API_SECRET=...`
- `SHOPIFY_SCOPES=...`
- `SHOPIFY_API_VERSION=2026-01`
- `SESSION_SECRET=...`
- `TOKEN_ENCRYPTION_KEY=...`
- `TIKTOK_APP_KEY=...`
- `TIKTOK_APP_SECRET=...`
- `TIKTOK_REDIRECT_URI=https://api.shopintel.example.com/api/v1/tiktok/callback`
- `TIKTOK_API_BASE_URL=https://open-api.tiktokglobalshop.com`
- `TIKTOK_WEBHOOK_SECRET=...`
- `TIKTOK_SHOP_AUTH_URL=https://auth.tiktok-shops.com`
- `TIKTOK_SHOP_TOKEN_PATH=/authorization/202309/token/get`
- `TIKTOK_SHOP_REFRESH_PATH=/authorization/202309/refresh_token`

### Database migration command

Run from backend release phase or one-off job:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

## 3. Frontend deployment package (Vercel)

- Root directory: `apps/web`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm --filter @spi/web build`
- Output directory: `dist`
- Config file: [vercel.json](/c:/Users/samso/OneDrive/Desktop/Shopify/apps/web/vercel.json)

### Frontend env vars

- `VITE_API_BASE_URL=https://api.shopintel.example.com`

## 4. Production URLs (no localhost)

- App subdomain: `https://app.shopintel.example.com`
- API subdomain: `https://api.shopintel.example.com`
- TikTok callback URL: `https://api.shopintel.example.com/api/v1/tiktok/callback`

## 5. GitHub push commands

```bash
git add .
git commit -m "chore: prepare split deployment architecture"
git push origin main
```

## 6. Backend deployment steps

1. Connect GitHub repo to backend platform.
2. Create API and worker services using monorepo root.
3. Apply env vars from the list above.
4. Provision managed Postgres and Redis.
5. Run migration commands.
6. Verify `https://api.shopintel.example.com/health` returns `{ "ok": true }`.

## 7. Vercel import steps

1. Import GitHub repo in Vercel.
2. Set root directory to `apps/web`.
3. Set `VITE_API_BASE_URL` to API subdomain.
4. Deploy and verify app loads under app subdomain.

## 8. Domain and DNS steps

1. Add `app.shopintel.example.com` CNAME to Vercel target.
2. Add `api.shopintel.example.com` CNAME/A record to backend platform target.
3. Wait for SSL provisioning.
4. Verify HTTPS and no mixed-content errors.

## 9. TikTok portal update steps

1. Open TikTok Shop developer portal.
2. Update app redirect URI to `https://api.shopintel.example.com/api/v1/tiktok/callback`.
3. Update webhook URL to `https://api.shopintel.example.com/api/v1/tiktok/webhooks`.
4. Ensure webhook signing secret matches `TIKTOK_WEBHOOK_SECRET`.

## 10. Smoke test checklist

1. App UI loads on app subdomain.
2. API `/health` passes.
3. TikTok connect flow opens auth and returns to app.
4. `sync-now` endpoint enqueues job.
5. Worker processes one sync run to completion.
6. One webhook with valid signature accepted.
7. One webhook with invalid signature rejected.
8. Diagnostics endpoint reflects real sync/webhook activity.
