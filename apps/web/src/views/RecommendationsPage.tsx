import { RecommendationCard } from "../components/RecommendationCard";
import { recommendations } from "../data/intelligenceMock";

export function RecommendationsPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Recommendation queue</span>
          <div className="chip-row">
            <span className="chip">Restock</span>
            <span className="chip">Markdown</span>
            <span className="chip">Bundle</span>
            <span className="chip">Supplier</span>
            <span className="chip">Push to TikTok</span>
            <span className="chip">Creator outreach</span>
            <span className="chip">Ad test</span>
            <span className="chip">Trend opportunity</span>
          </div>
        </div>
        <div className="dense-grid">
          {recommendations.map((item) => (
            <RecommendationCard item={item} key={item.title} />
          ))}
        </div>
      </div>
    </div>
  );
}
