# Security Checklist

- Validate Shopify OAuth HMAC and state
- Encrypt offline tokens at rest
- Validate webhook HMAC and dedupe delivery IDs
- Tenant-scope every query by `shopId`
- Separate online sessions from offline shop credentials
- Audit-log support/admin actions
- Redact secrets and tokens from logs
- Avoid unnecessary PII in AI prompts
- Enforce rate limits on internal APIs and webhook endpoints
- Keep competitor tracking disabled by default
