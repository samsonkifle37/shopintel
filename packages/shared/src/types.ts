export type OpportunityBand = "LOW" | "MEDIUM" | "HIGH";

export type RecommendationPayload = {
  entityId: string;
  entityType: "PRODUCT" | "VARIANT" | "COLLECTION" | "SHOP";
  rationale: string;
  estimatedImpact: string;
  confidence: number;
};
