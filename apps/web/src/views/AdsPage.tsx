import { ads } from "../data/intelligenceMock";

export function AdsPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Ad and creative intelligence</span>
        </div>
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Creative</th>
                <th>Hook</th>
                <th>CTA</th>
                <th>Platform</th>
                <th>Linked product</th>
                <th>Engagement</th>
                <th>Trend</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad[0]}>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div className="thumb" />
                      <span>{ad[0]}</span>
                    </div>
                  </td>
                  <td>{ad[1]}</td>
                  <td>{ad[2]}</td>
                  <td>{ad[3]}</td>
                  <td>{ad[4]}</td>
                  <td>{ad[5]}</td>
                  <td>
                    <span className="chip">{ad[6]}</span>
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="action-btn">Save creative</button>
                      <button className="action-btn">Tag angle</button>
                      <button className="action-btn primary">Cluster</button>
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
