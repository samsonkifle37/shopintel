import { Text } from "@shopify/polaris";
import { KpiTile } from "../data/intelligenceMock";

function sparkPath(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const height = 30;
  const width = 120;

  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / Math.max(max - min, 1)) * (height - 6) - 3;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export function KpiCard({ item }: { item: KpiTile }) {
  return (
    <div className="card card-pad">
      <div className="card-head">
        <span className="card-title">{item.label}</span>
        <span className={item.direction === "up" ? "delta-up" : "delta-down"}>{item.delta}</span>
      </div>
      <div className="metric-value">{item.value}</div>
      <svg className="sparkline" viewBox="0 0 120 30" preserveAspectRatio="none" aria-hidden="true">
        <path d={sparkPath(item.spark)} fill="none" stroke={item.direction === "up" ? "#0f9f6e" : "#cf3542"} strokeWidth="2" />
      </svg>
      <Text as="p" variant="bodySm" tone="subdued">
        7-point movement
      </Text>
    </div>
  );
}
