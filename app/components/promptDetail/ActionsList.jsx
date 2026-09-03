import { Card, Eyebrow } from "../UI";

export default function ActionsList({
  title = "Recommended Actions",
  actions = [],
  className = "",
}) {
  return (
    <Card className={`p-5 ${className}`}>
      <Eyebrow className="mb-3">{title}</Eyebrow>
      {actions.length === 0 ? (
        <p className="font-mono-sm text-mono-sm text-on-surface-variant">
          No recommended actions available.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {actions.map((act, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-surface-container-low px-3 py-2.5"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-black shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-[13px] font-mono-sm text-on-surface leading-relaxed">
                {act.title || act}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
