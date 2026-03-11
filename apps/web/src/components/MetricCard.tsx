import { Card, Text } from "@shopify/polaris";

type MetricCardProps = {
  label: string;
  value: string;
  delta?: string;
};

export function MetricCard({ label, value, delta }: MetricCardProps) {
  return (
    <Card>
      <Text as="p" tone="subdued" variant="bodySm">
        {label}
      </Text>
      <Text as="h3" variant="headingLg">
        {value}
      </Text>
      {delta ? (
        <Text as="p" tone="success" variant="bodySm">
          {delta}
        </Text>
      ) : null}
    </Card>
  );
}
