import { RecommendationRow } from "../data/intelligenceMock";

export function RecommendationCard({ item }: { item: RecommendationRow }) {
  return (
    <div className="card card-pad">
      <div className="card-head">
        <strong>{item.title}</strong>
        <span className={`score-pill ${item.priority === "High" ? "score-high" : item.priority === "Medium" ? "score-medium" : "score-low"}`}>
          {item.priority}
        </span>
      </div>
      <div className="chip-row" style={{ marginBottom: 8 }}>
        <span className="chip">{item.type}</span>
        <span className="chip">Confidence {item.confidence}</span>
        <span className="chip">Impact {item.impact}</span>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        {item.evidence}
      </p>
      <div className="action-row">
        <button className="action-btn primary">Accept</button>
        <button className="action-btn">Dismiss</button>
        <button className="action-btn">Snooze</button>
        <button className="action-btn">Assign</button>
      </div>
    </div>
  );
}
