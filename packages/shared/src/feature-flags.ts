export const featureFlags = {
  tiktokAuthEnabled: true,
  tiktokWebhooksEnabled: true,
  tiktokContentConnectorEnabled: true,
  tiktokCompetitorResearchEnabled: false
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;
