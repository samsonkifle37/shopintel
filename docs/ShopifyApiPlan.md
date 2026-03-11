# Shopify API Usage Plan

## Principle

Use Shopify GraphQL Admin API only.

## OAuth scopes

- `read_products`
- `read_orders`
- `read_inventory`
- `read_customers`
- `read_markets`
- `write_products`

## Core usage

- Shop bootstrap query for domain, currency, plan, and metadata
- Bulk product, variant, collection, order, customer, and inventory imports
- `appSubscriptionCreate`, `currentAppInstallation`, and `appSubscriptionCancel` for billing

## Webhooks

- `APP_UNINSTALLED`
- `APP_SUBSCRIPTIONS_UPDATE`
- `PRODUCTS_CREATE`
- `PRODUCTS_UPDATE`
- `PRODUCTS_DELETE`
- `INVENTORY_LEVELS_UPDATE`
- `ORDERS_CREATE`
- `ORDERS_UPDATED`
- `ORDERS_CANCELLED`
- `ORDERS_FULFILLED`
- `CUSTOMERS_CREATE`
- `CUSTOMERS_UPDATE`

## Handling rules

- Validate HMAC before processing
- Persist delivery IDs for dedupe
- Enqueue reconciliation jobs
- Return 200 quickly after durable enqueue
- Use retry-safe upserts
