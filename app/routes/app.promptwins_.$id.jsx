import { useState } from "react";
import { useParams } from "react-router";
import { promptApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { PageHeader, BackLink, Card } from "../components/UI";
import { LikelihoodBadge } from "../components/simulate/SimulateShared";

export default function PromptDetail() {
  const { id } = useParams();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("recomind_token")
      : null;
  const [tab] = useState("overview");

  const { data, loading, error, refetch } = useApi(
    token && id ? () => promptApi.getPrompt(id) : null,
    [token, id],
  );

  const payload = data?.data ?? data ?? {};
  const prompt = payload.prompt ?? {};
  const product = payload.product ?? null;
  const analysis = payload.analysis ?? null;
  const fix = payload.fix ?? null;

  // SCORE RING

  function PromptScoreRing({ score }) {
  const percentage = Number(score) || 0;

  const radius = 34;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  const ringColor = percentage <= 80 ? "#00E29E" : "#EF4444";

  return (
    <div className="relative w-24 h-24">
      <svg
        height="96"
        width="96"
        className="-rotate-90"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="48"
          cy="48"
        />

        <circle
          stroke={ringColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx="48"
          cy="48"
          style={{
            transition: "stroke-dashoffset .8s ease",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold text-on-surface">
          {percentage}
        </p>
        <p className="text-xs text-on-surface-variant">
          /100
        </p>
      </div>
    </div>
  );
}
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <BackLink to="/app/promptwins" />
        <div className="flex-1 min-w-0">
          <h1 className="font-headline-lg text-headline-lg text-on-surface truncate">
            {prompt.prompt || "Prompt"}
          </h1>
          <p className="text-secondary-fixed-dim mt-1 text-body-md">
            Prompt details, score, analysis and recommended actions.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-[11px] font-semibold text-on-surface-variant">
            Prompt
          </p>
          <h3 className="mt-3 text-lg font-bold text-on-surface">
            {prompt.prompt}
          </h3>
          <p className="mt-2 text-sm text-on-surface-variant">
            Product: {product?.title ?? "—"}
          </p>
        </Card>

        {/* <Card className="p-5">
          <p className="text-[11px] font-semibold text-on-surface-variant">
            Your Score
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-on-surface">
                {prompt.intentCoverageScore ?? "—"}
              </p>
              <p className="text-xs text-on-surface-variant">Intent coverage</p>
            </div>
            <LikelihoodBadge value={prompt.visibility} />
          </div>
        </Card> */}
        <Card className="p-4">
  {(() => {
    const score = Number(prompt.intentCoverageScore) || 0;

    const color =
  score >= 70
    ? "#00E29E" // Green
    : score >= 40
    ? "#F59E0B" // Orange
    : ""; // Red

    const heading =
       score >= 70
    ? "GOOD" 
    : score >= 40
    ? "MODERATE" 
    : "CRITICAL"; 


    return (
      <div className="flex items-center gap-6">
        <PromptScoreRing score={score}  />

        <div className="flex-1">
          <p
            className="text-2xl font-bold mb-2"
            style={{ color }}
          >
            {heading}
          </p>
        </div>
      </div>
    );
  })()}
</Card>

        <Card className="p-5">
          <p className="text-[11px] font-semibold text-on-surface-variant">
            AI Visibility
          </p>
          <div className="mt-3 space-y-2">
            {analysis?.comparison?.slice?.(0, 4)?.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="text-sm text-on-surface">{c.name}</div>
                <div className="text-sm font-semibold text-on-surface">
                  {c.score ?? "—"}
                </div>
              </div>
            ))}
            {!analysis?.comparison?.length && (
              <div className="text-sm text-on-surface-variant">
                Comparison not available
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-[11px] font-semibold text-error">
            Why You're Not Ranking Higher
          </p>
          <div className="mt-3 space-y-2 text-sm text-error">
            {(
              prompt.missingSignals ||
              fix?.reasons ||
              analysis?.missingSignals ||
              []
            )
              .slice(0, 6)
              .map((r, i) => (
                <div key={i}>• {r}</div>
              ))}
            {!(
              prompt.missingSignals ||
              fix?.reasons ||
              analysis?.missingSignals ||
              []
            ).length && (
              <div className="text-on-surface-variant">
                No obvious missing signals detected.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-semibold text-on-surface-variant">
            What to Improve
          </p>
          <div className="mt-3 space-y-2 text-sm text-on-surface">
            {(
              prompt.recommendations ||
              fix?.improvements ||
              analysis?.recommendations ||
              []
            )
              .slice(0, 6)
              .map((r, i) => (
                <div key={i}>✓ {r}</div>
              ))}
            {!(
              prompt.recommendations ||
              fix?.improvements ||
              analysis?.recommendations ||
              []
            ).length && (
              <div className="text-on-surface-variant">
                No improvement suggestions available.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-semibold text-on-surface-variant">
            Recommended Actions
          </p>
          <div className="mt-3 space-y-3">
            {(prompt.recommendedActions || fix?.actions || [])
              .slice(0, 6)
              .map((act, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-sm text-on-surface">
                    {act.title || act}
                  </div>
                  <button className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
                    Fix Now
                  </button>
                </div>
              ))}
            {!(fix?.actions || []).length && (
              <div className="text-on-surface-variant">
                No recommended actions available.
              </div>
            )}
          </div>
        </Card>
      </div>
      {/* Extra insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-[11px] font-semibold text-on-surface-variant">
            Ranking Factors
          </p>
          <div className="mt-3 space-y-2 text-sm text-on-surface">
            {(prompt.rankingFactors || []).slice(0, 8).map((f, i) => (
              <div key={i}>• {f}</div>
            ))}
            {!prompt.rankingFactors?.length && (
              <div className="text-on-surface-variant">
                No ranking factors available.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-semibold text-on-surface-variant">
            Competitor Signals
          </p>
          <div className="mt-3 space-y-2 text-sm text-on-surface">
            {(prompt.competitorDominating || prompt.comparison || [])
              .slice(0, 6)
              .map((c, i) => (
                <div key={i}>
                  • {typeof c === "string" ? c : c.name || JSON.stringify(c)}
                </div>
              ))}
            {!(prompt.competitorDominating || prompt.comparison || [])
              .length && (
              <div className="text-on-surface-variant">
                No competitor data available.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-semibold text-on-surface-variant">
            AI Reasoning
          </p>
          <div className="mt-3 text-sm text-on-surface">
            {prompt.reasoning ||
              analysis?.reasoning ||
              "No reasoning available."}
          </div>
        </Card>
      </div>
    </div>
  );
}
