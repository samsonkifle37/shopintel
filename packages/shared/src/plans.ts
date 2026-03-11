export type PlanTier = "STARTER" | "GROWTH" | "PRO" | "AGENCY";

export const planLimits: Record<
  PlanTier,
  {
    trackedEntities: number;
    historyDays: number;
    competitorStores: number;
    aiSummariesPerMonth: number;
    scheduledReports: number;
  }
> = {
  STARTER: { trackedEntities: 50, historyDays: 90, competitorStores: 0, aiSummariesPerMonth: 30, scheduledReports: 4 },
  GROWTH: { trackedEntities: 250, historyDays: 365, competitorStores: 2, aiSummariesPerMonth: 150, scheduledReports: 20 },
  PRO: { trackedEntities: 1000, historyDays: 730, competitorStores: 5, aiSummariesPerMonth: 500, scheduledReports: 60 },
  AGENCY: { trackedEntities: 5000, historyDays: 730, competitorStores: 25, aiSummariesPerMonth: 2000, scheduledReports: 200 }
};
