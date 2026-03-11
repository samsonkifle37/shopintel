import { FilterBar } from "../components/FilterBar";

export function SourcingPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Sourcing hub</span>
          <div className="action-row">
            <button className="action-btn">Import queue</button>
            <button className="action-btn primary">Push selected to draft</button>
          </div>
        </div>
        <FilterBar filters={["Supplier", "Warehouse country", "MOQ", "Shipping ETA", "Rating", "Landed cost", "Margin"]} />
        <div className="dense-table-wrap">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Supplier</th>
                <th>Source</th>
                <th>Landed cost</th>
                <th>Shipping estimate</th>
                <th>Warehouse</th>
                <th>MOQ</th>
                <th>Supplier rating</th>
                <th>Alt matches</th>
                <th>Recommended</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ice Silk Posture Tee</td>
                <td>Alibaba Direct #W-74</td>
                <td>Alibaba</td>
                <td>$9.70</td>
                <td>6-8 days</td>
                <td>US</td>
                <td>100</td>
                <td>4.8</td>
                <td>5</td>
                <td>
                  <span className="chip">Best source</span>
                </td>
                <td className="action-row">
                  <button className="action-btn">Compare</button>
                  <button className="action-btn">Push Shopify</button>
                  <button className="action-btn primary">Push TikTok</button>
                </td>
              </tr>
              <tr>
                <td>Magnetic Meal Prep Set</td>
                <td>CJdropshipping ZN-13</td>
                <td>CJdropshipping</td>
                <td>$8.90</td>
                <td>5-7 days</td>
                <td>UK</td>
                <td>80</td>
                <td>4.6</td>
                <td>3</td>
                <td>
                  <span className="chip">2nd best</span>
                </td>
                <td className="action-row">
                  <button className="action-btn">Compare</button>
                  <button className="action-btn">Push Shopify</button>
                  <button className="action-btn primary">Push TikTok</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
