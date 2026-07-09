// src/pages/simulate/ModeSimulate.jsx
import { useState } from "react";
import { promptApi } from "../../lib/api";
import {
  LikelihoodBadge,
  RunButton,
  ErrorBanner,
  ResultCard,
  inputCls,
} from "./SimulateShared";
import ProductSelector from "./ProductSelector";

export default function ModeSimulate({ token, history, refetchHistory }) {
  const [prompt, setPrompt] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function run() {
    if (!prompt.trim() || !productId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await promptApi.simulate(prompt, productId);
      setResult(res.data ?? res);
      refetchHistory();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ── Left: Input ── */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Shopping Prompt
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "best protein powder for beginners under $60"'
          className={`${inputCls} min-h-[120px] resize-none bg-surface-bright`}
          // className={`${inputCls} min-h-[120px] resize-none bg-surface-container-low`}
        />

        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Product
        </p>
        <ProductSelector token={token} value={productId} onChange={setProductId} />

        <ErrorBanner message={error} />

        <RunButton
          onClick={run}
          loading={loading}
          disabled={!prompt.trim() || !productId}
          label="Run AI Simulation →"
          loadingLabel="Running simulation…" className=""
        />
      </div>

      {/* ── Right: Result ── */}
      {/* <div className="space-y-4"> */}
      <div className="flex flex-col pt-7">
        {!result && (
          // <div className="rounded-2xl border border-outline-variant bg-surface-container-highest p-10 text-center text-sm text-on-surface-variant flex flex-col items-center gap-3">
          //   <span className="text-3xl">🎯</span>
          //   Results will appear here once a simulation runs.
          // </div>
          <div
  className="rounded-2xl border border-outline-variant bg-surface-bright
             min-h-[120px] flex flex-col items-center justify-center
             text-center text-sm text-on-surface-variant gap-3 px-8"
>
  <span className="text-4xl">🎯</span>

  <p className="font-semibold text-on-surface">
    No Simulation Yet
  </p>

  <p className="max-w-[260px]">
    Results will appear here once the simulation runs.
  </p>
</div>
        )}

        {result && (
          <>
            {/* Score + likelihood */}
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    Recommendation Score
                  </p>
                  <p className="text-4xl font-black text-on-surface leading-none">
                    {result.recommendationScore ?? "—"}
                    <span className="text-base font-semibold text-on-surface-variant ml-1">/100</span>
                  </p>
                </div>
                <LikelihoodBadge value={result.likelihood} />
              </div>
            </div>

            {result.buyerIntent && (
              <ResultCard label="Buyer Intent">
                <p className="text-sm text-on-surface">{result.buyerIntent}</p>
              </ResultCard>
            )}

            {result.missingSignals?.length > 0 && (
              <ResultCard label="Missing Signals" labelColor="text-error">
                <div className="space-y-1.5">
                  {result.missingSignals.map((s) => (
                    <div key={s} className="flex items-start gap-2 text-sm text-error">
                      <span className="shrink-0 mt-0.5">⚠</span>{s}
                    </div>
                  ))}
                </div>
              </ResultCard>
            )}

            {result.recommendations?.length > 0 && (
              <ResultCard label="Recommendations">
                <div className="space-y-1.5">
                  {result.recommendations.map((r) => (
                    <div key={r} className="flex items-start gap-2 text-sm text-on-surface">
                      <span className="text-primary shrink-0 mt-0.5">→</span>{r}
                    </div>
                  ))}
                </div>
              </ResultCard>
            )}

            {result.competitorDominating?.length > 0 && (
              <ResultCard label="Competitors Winning This">
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.competitorDominating.map((c) => (
                    <span key={c} className="rounded-full border border-error/30 bg-error/8 px-3 py-1 text-xs font-semibold text-error">
                      {c}
                    </span>
                  ))}
                </div>
              </ResultCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}
