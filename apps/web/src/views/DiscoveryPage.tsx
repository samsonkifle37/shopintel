import { FilterBar } from "../components/FilterBar";
import { ScorePill } from "../components/ScorePill";
import { discoveryRows } from "../data/intelligenceMock";

const filters = [
  "Channel",
  "Category",
  "Country",
  "Price band",
  "Trend score",
  "Margin %",
  "Competition",
  "Supplier source",
  "Shipping region",
  "Inventory risk",
  "Date range"
];

const tabs = ["Trending", "Breakout", "High Margin", "Low Competition", "Creator-led", "Supplier Ready", "Shopify Winners", "TikTok Winners"];

export function DiscoveryPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Discovery explorer</span>
        </div>
        <FilterBar filters={filters} />
        <div className="chip-row" style={{ marginBottom: 10 }}>
          {tabs.map((tab) => (
            <span className="chip" key={tab}>
              {tab}
            </span>
          ))}
        </div>
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Channels</th>
                <th>Revenue</th>
                <th>Units</th>
                <th>Trend</th>
                <th>Competition</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Landed cost</th>
                <th>Est. margin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discoveryRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div className="thumb" />
                      <div>
                        <strong>{row.title}</strong>
                        <div className="muted">{row.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="chip-row">
                      {row.channel.map((channel) => (
                        <span className="chip" key={`${row.id}-${channel}`}>
                          {channel}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{row.revenue}</td>
                  <td>{row.units}</td>
                  <td>
                    <ScorePill score={row.trendScore} />
                  </td>
                  <td>
                    <ScorePill score={100 - row.competitionScore} />
                  </td>
                  <td>{row.supplier}</td>
                  <td>{row.price}</td>
                  <td>{row.landedCost}</td>
                  <td>{row.margin}</td>
                  <td>
                    <div className="action-row">
                      <button className="action-btn">Track</button>
                      <button className="action-btn">Source</button>
                      <button className="action-btn">View</button>
                      <button className="action-btn primary">Push to Store</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
