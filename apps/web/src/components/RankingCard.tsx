type RankingItem = {
  name: string;
  growth: string;
  revenue: string;
};

type RankingCardProps = {
  title: string;
  items: RankingItem[];
};

export function RankingCard({ title, items }: RankingCardProps) {
  return (
    <div className="card card-pad">
      <div className="card-head">
        <span className="card-title">{title}</span>
      </div>
      <div className="rank-list">
        {items.map((item, index) => (
          <div className="rank-row" key={item.name}>
            <strong>{index + 1}</strong>
            <div>
              <div>{item.name}</div>
              <div className="muted">{item.revenue}</div>
            </div>
            <div className={item.growth.startsWith("-") ? "delta-down" : "delta-up"}>{item.growth}</div>
            <button className="action-btn">Track</button>
          </div>
        ))}
      </div>
    </div>
  );
}
