export type KpiTile = {
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  spark: number[];
};

export type DiscoveryRow = {
  id: string;
  title: string;
  channel: Array<"Shopify" | "TikTok">;
  revenue: string;
  units: string;
  trendScore: number;
  competitionScore: number;
  supplier: string;
  price: string;
  landedCost: string;
  margin: string;
};

export type RecommendationRow = {
  title: string;
  type: string;
  priority: "High" | "Medium" | "Low";
  confidence: string;
  impact: string;
  evidence: string;
  action: string;
};

export const kpis: KpiTile[] = [
  { label: "Revenue today", value: "$42.8K", delta: "+12.4%", direction: "up", spark: [28, 29, 31, 35, 34, 37, 42] },
  { label: "Revenue 7d", value: "$261K", delta: "+8.1%", direction: "up", spark: [188, 194, 210, 219, 231, 248, 261] },
  { label: "Orders 7d", value: "3,840", delta: "+6.3%", direction: "up", spark: [521, 534, 548, 553, 577, 599, 611] },
  { label: "Units sold", value: "6,291", delta: "+5.7%", direction: "up", spark: [801, 820, 840, 861, 905, 934, 951] },
  { label: "AOV", value: "$67.98", delta: "-1.8%", direction: "down", spark: [73, 72, 71, 71, 70, 68, 67] },
  { label: "Margin estimate", value: "29.6%", delta: "+2.2%", direction: "up", spark: [25, 25, 26, 27, 28, 29, 29] },
  { label: "Active alerts", value: "19", delta: "+4", direction: "down", spark: [9, 10, 12, 13, 15, 17, 19] },
  { label: "Trending products", value: "124", delta: "+21", direction: "up", spark: [58, 63, 71, 78, 90, 106, 124] },
  { label: "Source-ready products", value: "67", delta: "+11", direction: "up", spark: [29, 34, 38, 42, 50, 58, 67] }
];

export const discoveryRows: DiscoveryRow[] = [
  {
    id: "P-1001",
    title: "Ice Silk Posture Tee",
    channel: ["Shopify", "TikTok"],
    revenue: "$94,200",
    units: "5,120",
    trendScore: 93,
    competitionScore: 41,
    supplier: "CJ Prime #A-71",
    price: "$39.99",
    landedCost: "$11.80",
    margin: "52.1%"
  },
  {
    id: "P-1002",
    title: "Magnetic Meal Prep Set",
    channel: ["TikTok"],
    revenue: "$72,880",
    units: "4,010",
    trendScore: 89,
    competitionScore: 38,
    supplier: "AliExpress Fast #Q-22",
    price: "$29.50",
    landedCost: "$9.40",
    margin: "48.7%"
  },
  {
    id: "P-1003",
    title: "Micro Mist Hair Serum",
    channel: ["Shopify"],
    revenue: "$51,310",
    units: "2,203",
    trendScore: 78,
    competitionScore: 57,
    supplier: "AutoDS Elite #M-14",
    price: "$34.00",
    landedCost: "$13.90",
    margin: "40.2%"
  },
  {
    id: "P-1004",
    title: "Smart Grip Lifting Strap",
    channel: ["Shopify", "TikTok"],
    revenue: "$39,100",
    units: "1,771",
    trendScore: 81,
    competitionScore: 46,
    supplier: "Alibaba Direct #W-89",
    price: "$31.99",
    landedCost: "$10.60",
    margin: "50.4%"
  }
];

export const winners = [
  { name: "Ice Silk Posture Tee", growth: "+66%", revenue: "$94.2K" },
  { name: "Smart Grip Lifting Strap", growth: "+39%", revenue: "$39.1K" },
  { name: "Magnetic Meal Prep Set", growth: "+33%", revenue: "$72.8K" }
];

export const losers = [
  { name: "Travel Pouch", growth: "-26%", revenue: "$4.1K" },
  { name: "Classic Tote", growth: "-18%", revenue: "$8.8K" },
  { name: "Summer Clip Bundle", growth: "-12%", revenue: "$11.4K" }
];

export const recommendations: RecommendationRow[] = [
  {
    title: "Source cheaper supplier for Ice Silk Posture Tee",
    type: "Source cheaper supplier",
    priority: "High",
    confidence: "0.88",
    impact: "+7.2 margin points",
    evidence: "Alibaba alt landed cost is 19.4% lower vs current supplier over last 7d demand.",
    action: "Switch sourcing route"
  },
  {
    title: "Push Magnetic Meal Prep Set into Shopify draft",
    type: "Push to Shopify",
    priority: "High",
    confidence: "0.81",
    impact: "$24K potential 30d revenue",
    evidence: "TikTok creator-linked velocity and low competition score in US + UK.",
    action: "Create draft listing"
  },
  {
    title: "Run creator outreach for Smart Grip Lifting Strap",
    type: "Creator outreach",
    priority: "Medium",
    confidence: "0.74",
    impact: "+18% projected units",
    evidence: "High engagement / low conversion among fitness micro-creators indicates creative mismatch.",
    action: "Launch 5-creator test"
  }
];

export const creators = [
  ["FitWithNaya", "Fitness", "100K-250K", "7.2%", "11", "14", "High", "88"],
  ["HomeLabHack", "Home", "250K-500K", "6.8%", "9", "8", "Medium", "77"],
  ["GlowByReese", "Beauty", "50K-100K", "8.9%", "7", "6", "High", "83"]
];

export const ads = [
  ["15s UGC Split Screen", "Pain point first", "Shop now", "TikTok", "Ice Silk Posture Tee", "42K", "Rising"],
  ["Demo + Countdown", "Price objection bust", "Buy today", "TikTok", "Magnetic Meal Prep Set", "27K", "Breakout"],
  ["POV Narrative", "Lifestyle transform", "See details", "Meta", "Smart Grip Lifting Strap", "12K", "Stable"]
];
