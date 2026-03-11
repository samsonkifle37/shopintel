export function OnboardingPage() {
  return (
    <div className="dense-grid">
      <div className="card card-pad">
        <div className="card-head">
          <span className="card-title">Onboarding workflow</span>
          <span className="chip">Step 3/7</span>
        </div>
        <div className="rank-list">
          <div className="rank-row">
            <strong>1</strong>
            <div>Install app + OAuth</div>
            <span className="chip">Done</span>
            <button className="action-btn">Review</button>
          </div>
          <div className="rank-row">
            <strong>2</strong>
            <div>Select sync depth</div>
            <span className="chip">Done</span>
            <button className="action-btn">Review</button>
          </div>
          <div className="rank-row">
            <strong>3</strong>
            <div>Connect channels (Shopify, TikTok)</div>
            <span className="chip">In progress</span>
            <button className="action-btn primary">Continue</button>
          </div>
          <div className="rank-row">
            <strong>4</strong>
            <div>Configure sourcing providers</div>
            <span className="chip">Pending</span>
            <button className="action-btn">Open</button>
          </div>
          <div className="rank-row">
            <strong>5</strong>
            <div>Select operating goals</div>
            <span className="chip">Pending</span>
            <button className="action-btn">Open</button>
          </div>
          <div className="rank-row">
            <strong>6</strong>
            <div>Generate first AI summary</div>
            <span className="chip">Pending</span>
            <button className="action-btn">Run</button>
          </div>
          <div className="rank-row">
            <strong>7</strong>
            <div>Publish first recommendations queue</div>
            <span className="chip">Pending</span>
            <button className="action-btn">Run</button>
          </div>
        </div>
      </div>
    </div>
  );
}
