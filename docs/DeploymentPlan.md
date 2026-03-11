# Deployment Plan

## Runtime topology

- `apps/web` deployed as the embedded frontend
- `apps/api` deployed as the public app backend for OAuth, webhooks, and internal APIs
- `apps/worker` deployed as a separate worker process
- Managed Postgres for application data
- Managed Redis for queueing and cache
- Object storage for exports and report artifacts

## Environments

- Development: local `docker-compose` for Postgres and Redis
- Staging: isolated Shopify app config, shared observability, lower plan limits
- Production: separate app credentials, managed data stores, autoscaled worker

## Deployment sequence

1. Provision Postgres, Redis, object storage, and secret management
2. Set environment variables for app URL, Shopify credentials, database, Redis, and AI provider
3. Deploy API and web surfaces
4. Run Prisma migrations and client generation
5. Deploy worker with queue access
6. Register webhooks and validate delivery flow
7. Validate billing flows on a staging development store
8. Enable production traffic and monitor sync, webhook, and queue health

## Rollback strategy

- Keep previous API and web release artifacts available
- Use backward-compatible Prisma migrations first, destructive migrations later
- Disable new feature flags before code rollback if data contracts change
- Pause worker consumers if a faulty job processor is causing churn
