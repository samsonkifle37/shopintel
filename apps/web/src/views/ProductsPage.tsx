import { FilterBar } from "../components/FilterBar";
import { ScorePill } from "../components/ScorePill";
import { discoveryRows } from "../data/intelligenceMock";

export function ProductsPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Product Intelligence</span>
          <div className="action-row">
            <button className="action-btn">Saved view: Winners</button>
            <button className="action-btn">Sort: Trend desc</button>
            <button className="action-btn primary">Create saved view</button>
          </div>
        </div>
        <FilterBar
          filters={[
            "Channel",
            "Status",
            "Category",
            "Price",
            "Revenue",
            "Units",
            "Inventory",
            "Margin %",
            "Trend",
            "Demand",
            "Competition",
            "Supplier status",
            "Sync status"
          ]}
        />
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variants</th>
                <th>Price</th>
                <th>Revenue</th>
                <th>Units</th>
                <th>Inventory</th>
                <th>Margin</th>
                <th>Trend</th>
                <th>Demand</th>
                <th>Competition</th>
                <th>Supplier</th>
                <th>Sync</th>
                <th>Channels</th>
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
                        <div className="muted">Expand for detail</div>
                      </div>
                    </div>
                  </td>
                  <td>{Number(row.id.slice(-1)) + 3}</td>
                  <td>{row.price}</td>
                  <td>{row.revenue}</td>
                  <td>{row.units}</td>
                  <td>{(Number(row.id.slice(-2)) + 2) * 11}</td>
                  <td>{row.margin}</td>
                  <td>
                    <ScorePill score={row.trendScore} />
                  </td>
                  <td>
                    <ScorePill score={Math.max(50, row.trendScore - 6)} />
                  </td>
                  <td>
                    <ScorePill score={100 - row.competitionScore} />
                  </td>
                  <td>{row.supplier}</td>
                  <td>
                    <span className="chip">Synced 4m ago</span>
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
                  <td>
                    <div className="action-row">
                      <button className="action-btn">Track</button>
                      <button className="action-btn">Detail</button>
                      <button className="action-btn">Source</button>
                      <button className="action-btn primary">Push</button>
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
