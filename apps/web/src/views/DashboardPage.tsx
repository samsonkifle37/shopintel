import { KpiCard } from "../components/KpiCard";
import { RankingCard } from "../components/RankingCard";
import { RecommendationCard } from "../components/RecommendationCard";
import { ScorePill } from "../components/ScorePill";
import { discoveryRows, kpis, losers, recommendations, winners } from "../data/intelligenceMock";

export function DashboardPage() {
  return (
    <div className="dense-grid">
      <div className="dense-grid kpi-grid">
        {kpis.map((item) => (
          <KpiCard item={item} key={item.label} />
        ))}
      </div>

      <div className="section-grid-2">
        <RankingCard title="Top winners" items={winners} />
        <RankingCard title="Top losers" items={losers} />
      </div>

      <div className="section-grid-3">
        <div className="card card-pad">
          <div className="card-head">
            <span className="card-title">Breakout trend products</span>
          </div>
          <div className="rank-list">
            {discoveryRows.slice(0, 3).map((row) => (
              <div className="rank-row" key={row.id}>
                <div className="thumb" />
                <div>
                  <strong>{row.title}</strong>
                  <div className="muted">{row.revenue}</div>
                </div>
                <ScorePill score={row.trendScore} />
                <button className="action-btn primary">Track</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <span className="card-title">Low inventory risk</span>
          </div>
          <div className="chip-row">
            <span className="chip">Ice Silk Posture Tee - 3.4 days left</span>
            <span className="chip">Hydra Wrap Bottle - 5.1 days left</span>
            <span className="chip">Magnetic Meal Prep Set - 6.0 days left</span>
          </div>
          <div className="action-row" style={{ marginTop: 10 }}>
            <button className="action-btn primary">Create restock queue</button>
            <button className="action-btn">View at-risk SKUs</button>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <span className="card-title">Next best actions</span>
          </div>
          <div className="rank-list">
            <div className="rank-row">
              <strong>1</strong>
              <div>Switch supplier for Posture Tee</div>
              <span className="delta-up">+7.2 margin pts</span>
              <button className="action-btn primary">Apply</button>
            </div>
            <div className="rank-row">
              <strong>2</strong>
              <div>Push Meal Prep Set to Shopify</div>
              <span className="delta-up">+$24K potential</span>
              <button className="action-btn">Queue</button>
            </div>
            <div className="rank-row">
              <strong>3</strong>
              <div>Launch creator test for Grip Strap</div>
              <span className="delta-up">+18% units est.</span>
              <button className="action-btn">Assign</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Recommendation feed</span>
        </div>
        <div className="dense-grid">
          {recommendations.map((item) => (
            <RecommendationCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
