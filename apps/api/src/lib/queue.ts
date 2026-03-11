import { Queue } from "bullmq";
import { env } from "../config";
import { JobName } from "./job-names";

const connection = {
  url: env.REDIS_URL
};

export const syncQueue = new Queue("sync-shop", { connection });
export const analyticsQueue = new Queue("aggregate-kpis", { connection });
export const alertQueue = new Queue("process-alerts", { connection });
export const tiktokQueue = new Queue("tiktok-sync", { connection });
export const webhookRetryQueue = new Queue(JobName.TikTokWebhookRetry, { connection });
export const webhookDeadLetterQueue = new Queue(JobName.TikTokWebhookDeadLetter, { connection });
