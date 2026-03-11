# API Contract List

## Internal app API

- `GET /health`
- `GET /api/v1/auth/install?shop={shop}`
- `GET /api/v1/auth/callback`
- `POST /api/v1/webhooks/shopify`
- `GET /api/v1/dashboard/overview`
- `GET /api/v1/discovery`
- `GET /api/v1/tiktok-intelligence`
- `GET /api/v1/tiktok/connection`
- `GET /api/v1/tiktok/diagnostics`
- `POST /api/v1/tiktok/connect`
- `GET /api/v1/tiktok/callback`
- `POST /api/v1/tiktok/reconnect`
- `POST /api/v1/tiktok/sync-now`
- `POST /api/v1/tiktok/sync-daily`
- `POST /api/v1/tiktok/webhooks`
- `GET /api/v1/shops`
- `GET /api/v1/creators`
- `GET /api/v1/ads`
- `GET /api/v1/sourcing`
- `GET /api/v1/alerts`
- `GET /api/v1/products`
- `GET /api/v1/products/:productId`
- `GET /api/v1/trackers`
- `POST /api/v1/trackers`
- `GET /api/v1/recommendations`
- `GET /api/v1/reports`
- `POST /api/v1/billing/subscribe`

## Dashboard response

```ts
type DashboardOverviewResponse = {
  kpis: {
    snapshotDate: string;
    revenue: string;
    orders: number;
    unitsSold: number;
    averageOrderValue: string;
    grossMarginEstimate: string;
    repeatPurchaseRate: string;
  } | null;
  recommendations: Array<{
    id: string;
    title: string;
    category: string;
    confidenceScore: string;
    priority: number;
  }>;
};
```

## Product list response

```ts
type ProductListResponse = {
  items: Array<{
    id: string;
    title: string;
    vendor: string | null;
    totalRevenue: string;
    totalUnitsSold: number;
    inventoryOnHand: number;
    opportunityScore: number;
  }>;
};
```
