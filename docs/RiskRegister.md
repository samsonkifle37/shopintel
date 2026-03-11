# Risk Register

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Large syncs exceed API cost budgets | High | Medium | Bulk ops, staged imports, adaptive concurrency |
| Missing discovery data limits conversion attribution | High | High | Use proxies, add instrumentation and future connectors |
| AI outputs become generic | High | Medium | Evidence contracts, confidence scoring, prompt tests |
| Competitor monitoring creates policy risk | High | Medium | Feature flag, robots checks, public-only posture |
| Billing state drifts from entitlement state | High | Low | Subscription webhooks and reconciliation jobs |
