import { Card, Eyebrow } from "../UI";

const TONES = {
  error: { label: "text-error", bullet: "text-error" },
  success: { label: "text-green-win", bullet: "text-green-win" },
  neutral: { label: "text-on-surface-variant", bullet: "text-primary" },
};

/**
 * SignalCard — one card, a title, and a bulleted list of strings.
 * Reused for every "list of short findings" section on the prompt detail
 * page instead of four separate near-identical card implementations.
 *
 *   <SignalCard title="Why You're Not Ranking" tone="error" items={[...]} bullet="•" />
 */
export default function SignalCard({
  title,
  items = [],
  tone = "neutral",
  bullet = "•",
  emptyMessage = "Nothing to show here.",
  className = "",
}) {
  const t = TONES[tone] || TONES.neutral;

  return (
    <Card className={`p-5 ${className}`}>
      <Eyebrow className={`mb-3 ${t.label}`}>{title}</Eyebrow>
      {items.length === 0 ? (
        <p className="font-mono-sm text-mono-sm text-on-surface-variant">
          {emptyMessage}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-2 text-[13px] font-mono-sm text-on-surface leading-relaxed"
            >
              <span className={`shrink-0 ${t.bullet}`}>{bullet}</span>
              <span>
                {typeof item === "string"
                  ? item
                  : item.title || item.name || JSON.stringify(item)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
