export enum JobName {
  SyncShop = "sync-shop",
  ReconcileWebhook = "reconcile-webhook",
  TikTokInitialSync = "tiktok-initial-sync",
  TikTokIncrementalSync = "tiktok-incremental-sync",
  TikTokDailySync = "tiktok-daily-sync",
  TikTokWebhookRefresh = "tiktok-webhook-refresh",
  TikTokWebhookRetry = "tiktok-webhook-retry",
  TikTokWebhookDeadLetter = "tiktok-webhook-dead-letter",
  AggregateKpis = "aggregate-kpis",
  ScoreProducts = "score-products",
  DetectTrends = "detect-trends",
  GenerateRecommendations = "generate-recommendations",
  ProcessAlerts = "process-alerts",
  GenerateReport = "generate-report",
  GenerateAiSummary = "generate-ai-summary",
  CheckCompetitors = "check-competitors"
}
