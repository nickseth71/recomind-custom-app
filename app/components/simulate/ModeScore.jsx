// src/pages/simulate/ModeScore.jsx
import { useState } from "react";
import { promptApi } from "../../lib/api";
import {
  RunButton,
  ErrorBanner,
  ResultCard,
  LikelihoodBadge,
  inputCls,
  selectCls,
} from "./SimulateShared";
import ProductSelector from "./ProductSelector";

export default function ModeScore({ token }) {
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
      const res = await promptApi.score(prompt, productId);
      setResult(res.data ?? res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Score → color
  const scoreColor =
    result?.intentCoverageScore >= 70
      ? "text-green-win"
      : result?.intentCoverageScore >= 40
      ? "text-on-tertiary-fixed-variant"
      : "text-error";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      {/* ── Left ── */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Buyer Prompt
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter the buyer prompt to score…"
          className={`${inputCls} min-h-[120px] resize-none`}
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
          label="Score Prompt →"
          loadingLabel="Scoring…"
        />
      </div>

      {/* ── Right ── */}
      <div className="space-y-4">
        {!result && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-highest p-10 text-center text-sm text-on-surface-variant flex flex-col items-center gap-3">
            <span className="text-3xl">📊</span>
            Score results will appear here.
          </div>
        )}

        {result && (
          <>
            {/* Score hero */}
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    Intent Coverage Score
                  </p>
                  <p className={`text-4xl font-black leading-none ${scoreColor}`}>
                    {result.intentCoverageScore ?? "—"}
                    <span className="text-base font-semibold text-on-surface-variant ml-1">/100</span>
                  </p>
                </div>
                {result.visibility && <LikelihoodBadge value={result.visibility} />}
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
                      <span className="shrink-0">⚠</span>{s}
                    </div>
                  ))}
                </div>
              </ResultCard>
            )}

            {result.matchedAttributes?.length > 0 && (
              <ResultCard label="Matched Signals" labelColor="text-green-win">
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.matchedAttributes.map((a) => (
                    <span key={a} className="rounded-full border border-[#00e29e]/25 bg-[#00e29e]/10 px-3 py-1 text-xs font-semibold text-green-win">
                      ✓ {a}
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
