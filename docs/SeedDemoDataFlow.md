# Sample Seed And Demo Data Flow

## Goal

Provide a deterministic demo mode for local development and sales environments without depending on a live Shopify store.

## Flow

1. Create a demo `Shop` record for `demo-shop.myshopify.com`
2. Seed collections, products, variants, inventory levels, customers, orders, and KPI snapshots
3. Generate 30 to 180 days of `ProductSnapshot` and `TrendSnapshot` history
4. Insert sample `TrackedEntity`, `Alert`, and `Recommendation` rows
5. Run worker jobs for KPI aggregation and recommendation refresh to validate pipelines

## Demo scenarios

- A breakout new product
- A stockout-risk best seller
- A low-conversion high-interest product
- Dead inventory
- A bundle opportunity pair
- A declining collection
