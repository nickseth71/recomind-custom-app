import { Card, Eyebrow } from "../UI";

export default function EngineComparisonCard({
  title = "AI Visibility",
  items = [],
  className = "",
}) {
  const maxScore = Math.max(1, ...items.map((c) => Number(c.score) || 0));

  return (
    <Card className={`p-5 ${className}`}>
      <Eyebrow className="mb-3">{title}</Eyebrow>
      {items.length === 0 ? (
        <p className="font-mono-sm text-mono-sm text-on-surface-variant">
          Comparison not available.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.slice(0, 5).map((c, i) => {
            const score = Number(c.score) || 0;
            const pct = Math.round((score / maxScore) * 100);
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-mono-sm text-on-surface truncate">
                    {c.name}
                  </span>
                  <span className="text-[12px] font-bold text-on-surface shrink-0 ml-2">
                    {c.score ?? "—"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
