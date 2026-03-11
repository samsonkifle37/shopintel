export function SettingsPage() {
  return (
    <div className="section-grid-2">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Connectors</span>
        </div>
        <div className="chip-row">
          <span className="chip">Shopify: Connected</span>
          <span className="chip">TikTok Shop: Pending</span>
          <span className="chip">AutoDS: Disabled</span>
          <span className="chip">Alibaba: API Key missing</span>
        </div>
        <div className="action-row" style={{ marginTop: 10 }}>
          <button className="action-btn">Manage connectors</button>
        </div>
      </div>
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Billing and limits</span>
        </div>
        <div className="chip-row">
          <span className="chip">Plan: Growth</span>
          <span className="chip">Tracked entities: 241 / 250</span>
          <span className="chip">Alerts this month: 730 / 2,000</span>
        </div>
        <div className="action-row" style={{ marginTop: 10 }}>
          <button className="action-btn primary">Upgrade plan</button>
        </div>
      </div>
    </div>
  );
}
