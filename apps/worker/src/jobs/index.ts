import { JobName } from "@spi/shared/jobs";

export const supportedJobs = [
  JobName.SyncShop,
  JobName.ReconcileWebhook,
  JobName.TikTokInitialSync,
  JobName.TikTokIncrementalSync,
  JobName.TikTokDailySync,
  JobName.TikTokWebhookRefresh,
  JobName.TikTokWebhookRetry,
  JobName.TikTokWebhookDeadLetter,
  JobName.AggregateKpis,
  JobName.ScoreProducts,
  JobName.DetectTrends,
  JobName.GenerateRecommendations,
  JobName.ProcessAlerts,
  JobName.GenerateReport,
  JobName.GenerateAiSummary,
  JobName.CheckCompetitors
];
