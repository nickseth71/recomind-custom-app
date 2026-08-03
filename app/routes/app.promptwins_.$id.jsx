// app/routes/app.promptwins_.$id.jsx
// Prompt detail page — score, why it's not ranking, what to fix, and why.

import { useParams } from "react-router";
import { promptApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/Authcontext";
import { PageHeader, BackLink, Card, Eyebrow } from "../components/UI";
import AiSpinner from "../components/loader/AiSpinner";
import { AlertTriangle } from "lucide-react";

import PromptHero from "../components/promptDetail/PromptHero";
import SignalCard from "../components/promptDetail/SignalCard";
import ActionsList from "../components/promptDetail/ActionsList";
import ReasoningCard from "../components/promptDetail/ReasoningCard";
import EngineComparisonCard from "../components/promptDetail/EngineComparisonCard";

export default function PromptDetail() {
  const { id } = useParams();
  const { token } = useAuth();

  const { data, loading, error, refetch } = useApi(
    token && id ? () => promptApi.getPrompt(id) : null,
    [token, id],
  );

  const payload = data?.data ?? data ?? {};
  const prompt = payload.prompt ?? {};
  const product = payload.product ?? null;
  const analysis = payload.analysis ?? null;
  const fix = payload.fix ?? null;

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <AiSpinner label="Loading prompt visibility data..." />
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

  // Each section falls back through a few possible field names — the
  // underlying data can come from the live prompt scoring, a saved fix
  // record, or the product analysis, depending on how this prompt was
  // last evaluated.
  const missingSignals =
    prompt.missingSignals || fix?.reasons || analysis?.missingSignals || [];
  const improvements =
    prompt.recommendations ||
    fix?.improvements ||
    analysis?.recommendations ||
    [];
  const actions = prompt.recommendedActions?.length
    ? prompt.recommendedActions
    : fix?.actions || [];
  const rankingFactors = prompt.rankingFactors || [];
  const competitorSignals =
    prompt.competitorDominating || prompt.comparison || [];
  const reasoning = prompt.reasoning || analysis?.reasoning;
  const engineComparison = analysis?.comparison?.slice?.(0, 4) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <BackLink to="/app/promptwins" />
        <div className="flex-1 min-w-0">
          <PageHeader
            title="Prompt Detail"
            subtitle="Score, why it's not ranking higher, and what to fix."
          />
        </div>
      </div>

      <PromptHero prompt={prompt} product={product} />

      {/* Primary diagnosis — the two things that matter most, side by side */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SignalCard
          title="Why You're Not Ranking Higher"
          tone="error"
          bullet="✕"
          items={missingSignals}
          emptyMessage="No obvious missing signals detected."
        />
        <SignalCard
          title="What to Improve"
          tone="success"
          bullet="✓"
          items={improvements}
          emptyMessage="No improvement suggestions available."
        />
      </div>

      {/* Action plan + reasoning */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ActionsList actions={actions} />
        <ReasoningCard text={reasoning} />
      </div>

      {/* Supporting detail — ranking factors, competitor signals, engine comparison */}
      <div className="grid gap-5 lg:grid-cols-3">
        <SignalCard
          title="Ranking Factors"
          tone="neutral"
          items={rankingFactors.slice(0, 8)}
          emptyMessage="No ranking factors available."
        />
        <SignalCard
          title="Competitor Signals"
          tone="neutral"
          items={competitorSignals.slice(0, 6)}
          emptyMessage="No competitor data available."
        />
        <EngineComparisonCard items={engineComparison} />
      </div>
    </div>
  );
}
