export class BillingService {
  async subscribe(shopId: string, payload: unknown) {
    return {
      shopId,
      status: "PENDING_APPROVAL",
      payload
    };
  }
}
