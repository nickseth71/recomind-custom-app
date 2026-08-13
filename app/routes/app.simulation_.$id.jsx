// app/routes/app.simulation_.$id.jsx
// Simulation detail page — full stored detail for one prompt simulation.

import { useParams } from "react-router";
import { promptApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { PageHeader, BackLink, Card, Eyebrow } from "../components/UI";
import { LikelihoodBadge } from "../components/simulate/SimulateShared";
import AiSpinner from "../components/loader/AiSpinner";
import { AlertTriangle } from "lucide-react";

import ProgressCircle from "../components/ProgressCircle";
import SignalCard from "../components/promptDetail/SignalCard";
import ActionsList from "../components/promptDetail/ActionsList";

function scoreColor(score) {
  if (score >= 70) return "#00e29e";
  if (score >= 40) return "#e9ba00";
  return "#ba1a1a";
}

const COMPETITOR_STRENGTH_STYLES = {
  STRONG: { label: "Strong competition", tone: "error" },
  MODERATE: { label: "Moderate competition", tone: "neutral" },
  WEAK: { label: "Weak competition", tone: "success" },
};

export default function SimulationDetail() {
  const { id } = useParams();
  const { data, loading, error, refetch } = useApi(
    id ? () => promptApi.getSimulation(id) : null,
    [id],
  );

  const sim = data?.data ?? {};

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <AiSpinner label="Loading simulation..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <AlertTriangle size={44} className="text-error" strokeWidth={1.5} />
        <p className="text-error text-[14px] font-semibold text-center max-w-sm">
          {error}
        </p>
        <button
          onClick={refetch}
          className="px-5 py-2.5 rounded-xl font-bold border border-error/40 bg-error/10 text-error hover:bg-error/20 transition-all font-mono-sm text-mono-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const score = Number(sim.recommendationScore) || 0;
  const competitorStyle =
    COMPETITOR_STRENGTH_STYLES[sim.competitorStrength] ||
    COMPETITOR_STRENGTH_STYLES.MODERATE;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <BackLink to="/app/simulation" />
        <div className="flex-1 min-w-0">
          <PageHeader
            title="Simulation Detail"
            subtitle="Full result from a simulated buyer prompt."
          />
        </div>
      </div>

      {/* Hero */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex flex-col items-center shrink-0">
            <ProgressCircle
              value={score}
              max={100}
              size={112}
              strokeWidth={9}
              color={scoreColor(score)}
              centerLabel="/100"
            />
            <div className="mt-3">
              <LikelihoodBadge value={sim.likelihood} />
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center md:text-left">
            <Eyebrow>Simulated Prompt</Eyebrow>
            <h1 className="font-headline-md text-headline-md text-on-surface leading-snug mt-1">
              {sim.prompt}
            </h1>
            {sim.productId?.title && (
              <p className="mt-2 font-mono-sm text-mono-sm text-on-surface-variant">
                Product:{" "}
                <span className="text-on-surface font-semibold">
                  {sim.productId.title}
                </span>
              </p>
            )}
            {sim.buyerIntent && (
              <p className="mt-3 text-[13px] text-on-surface-variant leading-relaxed max-w-xl">
                {sim.buyerIntent}
              </p>
            )}
            {sim.createdAt && (
              <p className="mt-3 font-mono-sm text-[11px] text-on-surface-variant">
                Simulated {new Date(sim.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Missing signals + recommendations */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SignalCard
          title="Missing Signals"
          tone="error"
          bullet="✕"
          items={sim.missingSignals || []}
          emptyMessage="No missing signals — this product covers the prompt well."
        />
        <ActionsList
          title="Recommendations"
          actions={sim.recommendations || []}
        />
      </div>

      {/* Expected attributes + ranking factors + semantic gaps */}
      <div className="grid gap-5 lg:grid-cols-3">
        <SignalCard
          title="Expected Attributes"
          tone="neutral"
          items={sim.expectedAttributes || []}
          emptyMessage="No expected attributes recorded."
        />
        <SignalCard
          title="Ranking Factors"
          tone="neutral"
          items={sim.rankingFactors || []}
          emptyMessage="No ranking factors recorded."
        />
        <SignalCard
          title="Semantic Gaps"
          tone="neutral"
          items={sim.semanticGaps || []}
          emptyMessage="No semantic gaps identified."
        />
      </div>

      {/* Competitor context */}
      <Card className="p-5">
        <Eyebrow className="mb-3">Competitor Context</Eyebrow>
        <p className="text-[13px] font-semibold text-on-surface mb-3">
          {competitorStyle.label}
        </p>
        {sim.competitorDominating?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sim.competitorDominating.map((c) => (
              <span
                key={c}
                className="px-3 py-1 rounded-full text-[11px] font-semibold border border-outline-variant bg-surface-container-low text-on-surface"
              >
                {c}
              </span>
            ))}
          </div>
        ) : (
          <p className="font-mono-sm text-mono-sm text-on-surface-variant">
            No specific competitor brands identified for this prompt.
          </p>
        )}
      </Card>

      {/* Market context */}
      {sim.marketContext && Object.keys(sim.marketContext).length > 0 && (
        <Card className="p-5">
          <Eyebrow className="mb-3">Market Context</Eyebrow>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(sim.marketContext).map(([key, value]) => (
              <div key={key}>
                <p className="font-mono-sm text-[10px] uppercase tracking-wide text-on-surface-variant mb-0.5">
                  {key}
                </p>
                <p className="text-[13px] font-semibold text-on-surface">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Raw AI response — debug/audit detail */}
      {sim.rawAiResponse && (
        <Card className="p-5">
          <Eyebrow className="mb-3">Raw AI Response</Eyebrow>
          <pre className="font-mono-sm text-[11px] text-on-surface-variant whitespace-pre-wrap break-words bg-surface-container-highest rounded-xl p-4 max-h-96 overflow-y-auto">
            {sim.rawAiResponse}
          </pre>
        </Card>
      )}
    </div>
  );
}
