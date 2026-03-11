export function AlertsPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Alerts center</span>
          <button className="action-btn">Filter severity</button>
        </div>
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Entity</th>
                <th>Severity</th>
                <th>Signal</th>
                <th>Detected</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Low inventory</td>
                <td>Ice Silk Posture Tee / V2</td>
                <td>
                  <span className="score-pill score-low">Critical</span>
                </td>
                <td>3.4 days left</td>
                <td>12 min ago</td>
                <td>Ops</td>
                <td className="action-row">
                  <button className="action-btn primary">Restock</button>
                  <button className="action-btn">Assign</button>
                </td>
              </tr>
              <tr>
                <td>Creator breakout</td>
                <td>FitWithNaya</td>
                <td>
                  <span className="score-pill score-high">High</span>
                </td>
                <td>+220% video velocity</td>
                <td>41 min ago</td>
                <td>Growth</td>
                <td className="action-row">
                  <button className="action-btn">Outreach</button>
                  <button className="action-btn">Track</button>
                </td>
              </tr>
              <tr>
                <td>Supplier issue</td>
                <td>CJ Prime #A-71</td>
                <td>
                  <span className="score-pill score-medium">Medium</span>
                </td>
                <td>ETA +3.2 days</td>
                <td>2h ago</td>
                <td>Sourcing</td>
                <td className="action-row">
                  <button className="action-btn">Find alternative</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
