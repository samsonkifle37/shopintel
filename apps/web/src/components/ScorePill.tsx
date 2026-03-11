export function ScorePill({ score }: { score: number }) {
  const tone = score >= 80 ? "score-high" : score >= 60 ? "score-medium" : "score-low";
  return <span className={`score-pill ${tone}`}>{score}</span>;
}
