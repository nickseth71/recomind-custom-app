// src/pages/simulate/ModeIntelligence.jsx
import { useState } from "react";
import { promptApi } from "../../lib/api";
import { RunButton, ErrorBanner, ResultCard, inputCls } from "./SimulateShared";

export default function ModeIntelligence() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function run() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await promptApi.analyse(prompt);
      setResult(res.data ?? res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      {/* ── Left: Input ── */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Shopping Query
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "best electrolyte drink for runners"'
          className={`${inputCls} min-h-[120px] resize-none`}
        />

        <ErrorBanner message={error} />

        <RunButton
          onClick={run}
          loading={loading}
          disabled={!prompt.trim()}
          label="Analyse Prompt Intelligence →"
          loadingLabel="Analysing…"
        />
      </div>

      {/* ── Right: Result ── */}
      <div className="space-y-4">
        {!result && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-highest p-10 text-center text-sm text-on-surface-variant flex flex-col items-center gap-3">
            <span className="text-3xl">🔍</span>
            Intelligence report will appear here.
          </div>
        )}

        {result && (
          <>
            {/* Summary row */}
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                {result.rankingCompetitiveness && (
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold border ${
                    result.rankingCompetitiveness === "LOW"
                      ? "text-green-win bg-[#00e29e]/10 border-[#00e29e]/25"
                      : result.rankingCompetitiveness === "MEDIUM"
                      ? "text-on-tertiary-fixed-variant bg-tertiary-fixed/15 border-tertiary-fixed/30"
                      : "text-error bg-error/10 border-error/25"
                  }`}>
                    {result.rankingCompetitiveness} Competition
                  </span>
                )}
                {result.queryType && (
                  <span className="rounded-full px-3 py-1 text-[11px] font-bold border border-outline-variant bg-surface-container-highest text-on-surface-variant">
                    {result.queryType}
                  </span>
                )}
                {result.merchantCanWin && (
                  <span className="rounded-full px-3 py-1 text-[11px] font-bold border border-[#00e29e]/25 bg-[#00e29e]/10 text-green-win">
                    Can Win ✓
                  </span>
                )}
              </div>
            </div>

            {result.buyerIntent && (
              <ResultCard label="Buyer Intent">
                <p className="text-sm text-on-surface">{result.buyerIntent}</p>
              </ResultCard>
            )}

            {result.winStrategy && (
              <ResultCard label="Win Strategy">
                <p className="text-sm text-on-surface">{result.winStrategy}</p>
              </ResultCard>
            )}

            {result.promptVariants?.length > 0 && (
              <ResultCard label="Related Prompts to Target">
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.promptVariants.map((v) => (
                    <span key={v} className="rounded-full border border-outline-variant bg-surface-container-highest px-3 py-1 text-xs text-on-surface">
                      {v}
                    </span>
                  ))}
                </div>
              </ResultCard>
            )}

            {result.contentGaps?.length > 0 && (
              <ResultCard label="Content Gaps" labelColor="text-error">
                <div className="space-y-1.5">
                  {result.contentGaps.map((g) => (
                    <div key={g} className="flex items-start gap-2 text-sm text-error">
                      <span className="shrink-0">⚠</span>{g}
                    </div>
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
