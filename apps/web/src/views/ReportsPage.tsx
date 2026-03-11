export function ReportsPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Reports and scheduling</span>
          <div className="action-row">
            <button className="action-btn">Schedule report</button>
            <button className="action-btn primary">Export CSV/PDF</button>
          </div>
        </div>
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Cadence</th>
                <th>Last run</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Daily snapshot</td>
                <td>Daily 08:00</td>
                <td>Today 08:02</td>
                <td>
                  <span className="chip">Complete</span>
                </td>
                <td>Ops</td>
                <td className="action-row">
                  <button className="action-btn">View</button>
                  <button className="action-btn">Export</button>
                </td>
              </tr>
              <tr>
                <td>TikTok opportunity report</td>
                <td>Weekly Mon</td>
                <td>Mar 10</td>
                <td>
                  <span className="chip">Queued</span>
                </td>
                <td>Growth</td>
                <td className="action-row">
                  <button className="action-btn">Edit schedule</button>
                </td>
              </tr>
              <tr>
                <td>Supplier opportunity report</td>
                <td>Weekly Tue</td>
                <td>Mar 9</td>
                <td>
                  <span className="chip">Complete</span>
                </td>
                <td>Sourcing</td>
                <td className="action-row">
                  <button className="action-btn">Export</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
