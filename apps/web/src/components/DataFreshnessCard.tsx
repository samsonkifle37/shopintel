type DataFreshnessCardProps = {
  label: string;
  lastSync: string | null;
  freshnessMinutes: number | null;
  mode: "live" | "demo" | "estimated";
};

export function DataFreshnessCard({ label, lastSync, freshnessMinutes, mode }: DataFreshnessCardProps) {
  const freshnessLabel = freshnessMinutes === null ? "unknown" : `${freshnessMinutes} min`;
  return (
    <div className="card card-pad">
      <div className="card-head">
        <span className="card-title">{label}</span>
        <span className="chip">Mode: {mode}</span>
      </div>
      <div className="metric-value">{freshnessLabel}</div>
      <div className="muted">Last sync: {lastSync ?? "never"}</div>
    </div>
  );
}
