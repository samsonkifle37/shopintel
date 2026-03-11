import { creators } from "../data/intelligenceMock";

export function CreatorsPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Creator intelligence</span>
        </div>
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Creator</th>
                <th>Niche</th>
                <th>Follower band</th>
                <th>Engagement</th>
                <th>Linked products</th>
                <th>Linked shops</th>
                <th>Content velocity</th>
                <th>Win rate</th>
                <th>Trend score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((creator) => (
                <tr key={creator[0]}>
                  <td>{creator[0]}</td>
                  <td>{creator[1]}</td>
                  <td>{creator[2]}</td>
                  <td>{creator[3]}</td>
                  <td>{creator[4]}</td>
                  <td>{creator[5]}</td>
                  <td>{creator[6]}</td>
                  <td>{creator[3]}</td>
                  <td>{creator[7]}</td>
                  <td>
                    <div className="action-row">
                      <button className="action-btn">Save</button>
                      <button className="action-btn">Products</button>
                      <button className="action-btn primary">Compare</button>
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
