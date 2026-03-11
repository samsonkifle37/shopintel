import { analyticsQueue, syncQueue, tiktokQueue } from "../lib/queue";
import { JobName } from "../lib/job-names";

export class JobService {
  async enqueueInitialSync(shopDomain: string) {
    await syncQueue.add(JobName.SyncShop, { shopDomain, reason: "install" });
    await analyticsQueue.add(JobName.AggregateKpis, { shopDomain, reason: "install" });
  }

  async enqueueTikTokInitialSync(shopId: string, trigger = "oauth") {
    await tiktokQueue.add(JobName.TikTokInitialSync, { shopId, trigger });
  }

  async enqueueTikTokIncrementalSync(shopId: string, trigger = "manual") {
    await tiktokQueue.add(JobName.TikTokIncrementalSync, { shopId, trigger });
  }

  async enqueueTikTokDailySync(shopId: string) {
    await tiktokQueue.add(JobName.TikTokDailySync, { shopId, trigger: "scheduled" });
  }

  async enqueueTikTokWebhookRefresh(shopId: string, webhookEventId: string) {
    await tiktokQueue.add(JobName.TikTokWebhookRefresh, { shopId, webhookEventId, trigger: "webhook" });
  }
}
