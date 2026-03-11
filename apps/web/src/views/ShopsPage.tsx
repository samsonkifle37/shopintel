import { ScorePill } from "../components/ScorePill";

export function ShopsPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Shops intelligence</span>
          <button className="action-btn primary">Add to watchlist</button>
        </div>
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Shop</th>
                <th>Channel</th>
                <th>Product count</th>
                <th>Activity</th>
                <th>Top categories</th>
                <th>Catalog growth</th>
                <th>Price movement</th>
                <th>Winning products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>UrbanPeakGear</td>
                <td>Shopify</td>
                <td>420</td>
                <td>
                  <ScorePill score={82} />
                </td>
                <td>Fitness, Accessories</td>
                <td className="delta-up">+14%</td>
                <td className="delta-down">-3.2%</td>
                <td>3</td>
                <td className="action-row">
                  <button className="action-btn">Track</button>
                  <button className="action-btn">Compare</button>
                </td>
              </tr>
              <tr>
                <td>VibeKitchenLive</td>
                <td>TikTok Shop</td>
                <td>190</td>
                <td>
                  <ScorePill score={90} />
                </td>
                <td>Kitchen, Home</td>
                <td className="delta-up">+28%</td>
                <td className="delta-up">+4.4%</td>
                <td>7</td>
                <td className="action-row">
                  <button className="action-btn">Watch</button>
                  <button className="action-btn primary">Alert</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
