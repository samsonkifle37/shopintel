# Shopify Product Intelligence Suite

Production-grade embedded Shopify SaaS scaffold for product intelligence, trend detection, tracking, recommendations, and reporting.

## Monorepo layout

- `apps/web`: embedded React app using Polaris and App Bridge
- `apps/api`: Node.js TypeScript API for OAuth, webhooks, reporting, and application services
- `apps/worker`: BullMQ worker for sync, scoring, trend, alert, and report jobs
- `packages/db`: Prisma schema and database client
- `packages/shared`: shared types, feature flags, plan definitions, and contracts
- `docs`: PRD, architecture, API plan, roadmap, ERD, security, testing, analytics, and launch assets

## MVP priorities

1. Product intelligence dashboard
2. Trend engine
3. Tracker and alerts
4. AI recommendations
5. Billing
6. Competitor module behind feature flags

## Core stack

- Frontend: React, Vite, TypeScript, Shopify Polaris, App Bridge
- Backend: Fastify, TypeScript, Shopify GraphQL Admin API
- Data: Postgres, Prisma, Redis, BullMQ
- Auth: Shopify OAuth with offline and online sessions
- Jobs: initial sync, nightly sync, webhook reconciliation, KPI aggregation, trend detection, recommendations, reports

## Key docs

- [PRD](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/PRD.md)
- [System architecture](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/SystemArchitecture.md)
- [ERD](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/ERD.md)
- [Shopify API plan](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/ShopifyApiPlan.md)
- [API contracts](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/ApiContracts.md)
- [Deployment plan](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/DeploymentPlan.md)
- [Split deployment runbook](/c:/Users/samso/OneDrive/Desktop/Shopify/DEPLOYMENT.md)
- [Go-live checklist](/c:/Users/samso/OneDrive/Desktop/Shopify/GO_LIVE_CHECKLIST.md)
- [TikTok live ingestion](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/TikTokLiveIngestion.md)
- [TikTok dev checklist](/c:/Users/samso/OneDrive/Desktop/Shopify/docs/TikTokDevChecklist.md)
