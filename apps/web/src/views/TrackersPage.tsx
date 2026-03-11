export function TrackersPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Trackers</span>
          <button className="action-btn primary">Add tracker</button>
        </div>
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Tracked entity</th>
                <th>Type</th>
                <th>Channel</th>
                <th>Trigger</th>
                <th>Last event</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ice Silk Posture Tee / Variant S</td>
                <td>Product</td>
                <td>Shopify</td>
                <td>Inventory &lt; 40</td>
                <td>15 min ago</td>
                <td>
                  <span className="chip">Active</span>
                </td>
                <td className="action-row">
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Pause</button>
                </td>
              </tr>
              <tr>
                <td>FitWithNaya</td>
                <td>Creator</td>
                <td>TikTok</td>
                <td>Velocity +80%</td>
                <td>41 min ago</td>
                <td>
                  <span className="chip">Active</span>
                </td>
                <td className="action-row">
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Pause</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
