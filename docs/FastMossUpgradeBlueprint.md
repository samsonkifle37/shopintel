# FastMoss-Inspired Multi-Channel Upgrade Blueprint

## A. Updated Information Architecture

### Primary nav

- Dashboard
- Discovery
- Products
- TikTok Intelligence
- Shops
- Creators
- Ads
- Sourcing
- Trackers
- Recommendations
- Reports
- Alerts
- Settings

### Experience principles

- Discovery-first decision flow
- Ranking and movement indicators everywhere
- Action buttons embedded at row-level
- Filters and saved views as first-class controls
- Score-driven triage for trend, demand, competition, sourcing, and urgency

## B. New Wireframe Plan

### Dashboard

- KPI strip (9 tiles) with delta and sparkline
- Top winners / top losers
- Breakout products panel
- Low inventory risk panel
- Supplier opportunities panel
- TikTok breakout panel
- Recommendation feed cards
- Next best actions queue

### Discovery

- Filter rail and tabbed rankings
- Dense product matrix with channel badges and sourcing economics
- Row action set: Track, Source, View, Push to Store

### Products

- Advanced filter set, saved views, sortable columns
- Expanded intelligence columns (trend, demand, competition, supplier, sync, channels)
- Row-level quick actions and expansion affordance

### TikTok Intelligence

- Top products, videos, creators, rising shops, winning hooks
- Product-video map and engagement sell-through signal table
- High-engagement / low-conversion warning surface

### Shops / Creators / Ads / Sourcing / Alerts

- Dense watchlist-capable ranking tables
- Cross-linked entities (creator to product, ad to product, shop to catalog)
- Sourcing comparison engine blocks with landed-cost emphasis
- Dedicated alert center with severity and owner workflow

## C. Component Inventory

### New UI system components

- `KpiCard` with sparkline and directional delta
- `FilterBar` for high-frequency faceted filtering
- `ScorePill` for trend/demand/competition normalization
- `RankingCard` for top movers/winners/losers
- `RecommendationCard` with evidence + workflow actions

### Shared patterns

- Dense sticky-header table container
- Badge/chip clusters for channel, status, and segments
- Inline action group on every major row
- Multi-panel command-center grid sections

### Screen components added

- `DashboardPage`
- `DiscoveryPage`
- `ProductsPage`
- `TikTokIntelligencePage`
- `ShopsPage`
- `CreatorsPage`
- `AdsPage`
- `SourcingPage`
- `TrackersPage`
- `RecommendationsPage`
- `ReportsPage`
- `AlertsPage`

## D. Revised Database Schema

The updated schema is implemented in [schema.prisma](/c:/Users/samso/OneDrive/Desktop/Shopify/packages/db/prisma/schema.prisma).

### New core entities

- `Channel`
- `CommerceShop`
- `Creator`
- `AdCreative`
- `ExternalProduct`
- `SourceSupplier`
- `SupplierOffer`
- `ImportJob`
- `ProductChannelMetric`
- `CreatorProductLink`
- `AdProductLink`
- `Watchlist`

### New enums

- `ChannelType`
- `ShopKind`
- `IntegrationStatus`
- `AlertSeverity`
- `RecommendationStatus`

### Existing entities extended

- `Shop` extended with cross-channel and sourcing relations
- `Product` extended with external mapping, channel metrics, supplier offers, and watchlists
- `Alert` now uses typed severity enum
- `Recommendation` now includes status enum + evidence metadata fields

## E. API and Integration Architecture

### Internal API surface added

- `GET /api/v1/discovery`
- `GET /api/v1/tiktok-intelligence`
- `GET /api/v1/shops`
- `GET /api/v1/creators`
- `GET /api/v1/ads`
- `GET /api/v1/sourcing`
- `GET /api/v1/alerts`

### Connector architecture

- Channel connectors:
  - Shopify Admin GraphQL connector (existing)
  - TikTok Shop connector interface (new module boundary)
- Supplier connectors:
  - AutoDS connector interface
  - Alibaba connector interface
  - AliExpress connector interface
  - CJdropshipping connector interface
- Connector contract:
  - auth/state
  - sync cursor
  - normalized object mappers
  - rate-limit policy
  - retry and dead-letter strategy

### Data layer separation

- Internal store data: Shopify-native catalog/orders/inventory
- External trend data: TikTok products/creators/ads/shops
- Supplier data: offers, shipping, MOQ, rating, landed cost
- Recommendation layer: evidence-backed actions over normalized entities

## F. Implementation Roadmap

### Phase 1 (current sprint target)

- Dashboard redesign
- Discovery explorer
- Upgraded products intelligence table
- Sourcing hub basic comparison and push actions
- Recommendation cards with workflow actions

### Phase 2

- TikTok Intelligence module
- Shops intelligence
- Creators intelligence
- Ads intelligence
- Alerts center

### Phase 3

- Supplier matching automation
- AI recommendation engine hardening
- Automated push workflows to Shopify/TikTok draft pipelines
- Advanced reporting and scheduled intelligence digests

## G. Code Changes Needed for Current MVP

### Completed in this upgrade pass

- Frontend IA/routes/nav replaced for multi-channel command center
- Dense visual system and high-density table patterns added
- New module pages and action-oriented row controls implemented
- Prisma schema expanded to multi-channel intelligence + sourcing model
- API route/service stubs added for new module endpoints

### Next engineering tasks to productionize

1. Hook frontend modules to API data instead of static mock arrays
2. Add Prisma migrations and DB backfill scripts for new tables
3. Implement TikTok and supplier connector adapters behind feature flags
4. Add queue processors for cross-channel sync, scoring, and alert fanout
5. Add policy-safe competitor and external monitoring toggles
6. Add role-based assignment workflows for recommendations/alerts

## H. Seed Demo Data for New Screens

Seed package for all new screens is provided in [multichannel-demo.json](/c:/Users/samso/OneDrive/Desktop/Shopify/packages/db/prisma/seed/multichannel-demo.json).

### Included demo sets

- KPI snapshots and movement series
- Discovery products with channel/supplier economics
- TikTok creators, shops, ads, and product links
- Supplier offers with landed-cost comparison
- Recommendations and alerts with workflow states
- Watchlists for products, shops, creators, and ads
