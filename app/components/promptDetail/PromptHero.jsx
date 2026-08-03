import ProgressCircle from "../ProgressCircle";
import { VisibilityPill } from "../PromptRow";
import { Card, Eyebrow } from "../UI";

function scoreMeta(score) {
  if (score >= 70) return { color: "#00e29e", heading: "GOOD" };
  if (score >= 40) return { color: "#e9ba00", heading: "MODERATE" };
  return { color: "#ba1a1a", heading: "CRITICAL" };
}

export default function PromptHero({ prompt, product }) {
  const score = Number(prompt.intentCoverageScore) || 0;
  const { color, heading } = scoreMeta(score);

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex flex-col items-center shrink-0">
          <ProgressCircle
            value={score}
            max={100}
            size={128}
            strokeWidth={10}
            color={color}
            centerLabel="/100"
            centerValueClassName="text-[32px] font-black text-on-surface leading-none"
            centerLabelClassName="font-mono-sm text-[11px] text-on-surface-variant mt-0.5"
          />
          <p
            className="mt-3 text-[15px] font-extrabold tracking-wide"
            style={{ color }}
          >
            {heading}
          </p>
        </div>

        <div className="flex-1 min-w-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2 flex-wrap">
            <Eyebrow>Prompt</Eyebrow>
            <VisibilityPill vis={prompt.visibility} />
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface leading-snug">
            "{prompt.prompt}"
          </h1>
          {product?.title && (
            <p className="mt-2 font-mono-sm text-mono-sm text-on-surface-variant">
              Product:{" "}
              <span className="text-on-surface font-semibold">
                {product.title}
              </span>
            </p>
          )}
          {prompt.buyerIntent && (
            <p className="mt-3 text-[13px] text-on-surface-variant leading-relaxed max-w-xl">
              {prompt.buyerIntent}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
