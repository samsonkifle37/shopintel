export type TikTokRawProduct = {
  id: string;
  title: string;
  image_url?: string;
  price?: string;
  skus?: Array<{ id: string; seller_sku?: string; price?: string; quantity?: number }>;
};

export type TikTokRawOrder = {
  id: string;
  create_time?: number;
  total_amount?: string;
  line_items?: Array<{ product_id: string; sku_id?: string; quantity?: number; amount?: string }>;
};

export class TikTokNormalizer {
  normalizeProduct(raw: TikTokRawProduct) {
    return {
      externalProductId: raw.id,
      title: raw.title,
      thumbnailUrl: raw.image_url ?? null,
      price: raw.price ? Number(raw.price) : 0,
      skus:
        raw.skus?.map((sku) => ({
          externalSkuId: sku.id,
          sku: sku.seller_sku ?? null,
          price: sku.price ? Number(sku.price) : 0,
          quantity: sku.quantity ?? 0
        })) ?? []
    };
  }

  normalizeOrder(raw: TikTokRawOrder) {
    return {
      externalOrderId: raw.id,
      createdAt: raw.create_time ? new Date(raw.create_time * 1000) : new Date(),
      totalAmount: raw.total_amount ? Number(raw.total_amount) : 0,
      lineItems:
        raw.line_items?.map((line) => ({
          externalProductId: line.product_id,
          externalSkuId: line.sku_id ?? null,
          quantity: line.quantity ?? 0,
          amount: line.amount ? Number(line.amount) : 0
        })) ?? []
    };
  }
}
