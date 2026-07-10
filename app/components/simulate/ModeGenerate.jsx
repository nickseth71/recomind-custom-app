// src/pages/simulate/ModeGenerate.jsx
import { useState, useEffect } from "react";
import { promptApi } from "../../lib/api";
import {
  LikelihoodBadge,
  RunButton,
  ErrorBanner,
  ResultCard,
  inputCls,
} from "./SimulateShared";
import { Link } from "react-router";
import ProductSelector from "./ProductSelector";
import { Loader2 } from "lucide-react";

export default function ModeGenerate({ token }) {
  const [productId, setProductId] = useState("");
  const [manualText, setManualText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [existing, setExisting] = useState(null);
  const [error, setError] = useState(null);

  // Auto-load existing when product changes
  useEffect(() => {
    if (productId) loadExisting();
  }, [productId]); // eslint-disable-line

  async function loadExisting() {
    setLoadingExisting(true);
    try {
      const res = await promptApi.getProductPrompts(productId);
      setExisting(res.data ?? res);
    } catch (e) {
      // Silently fail — not critical
    } finally {
      setLoadingExisting(false);
    }
  }

  async function generate() {
    if (!productId) return;
    setGenerating(true);
    setError(null);
    setGenerated(null);
    try {
      const prompts = manualText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const res = await promptApi.generateProductPrompts(productId, prompts);
      setGenerated(res.data ?? res);
      await loadExisting();
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  const existingPrompts = existing?.prompts ?? [];
  const planLimits = existing?.planLimits;

  return (
    // <div className="flex flex-col items-center justify-center gap-2">
    <div className="space-y-4">
      {/* ── Left: Controls ── */}
        <div>
        {/* <div className="rounded-2xl border border-outline-variant bg-surface p-5 space-y-5">
         */}
         <div className="rounded-2xl border border-outline-variant bg-surface-container p-5 ml-1 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Product
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Search your catalog, select a product, and then generate scored
              prompts for it.
            </p>
          </div>

          <ProductSelector
            token={token}
            value={productId}
            onChange={setProductId}
          />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Manual Prompts
              <span className="ml-2 font-normal normal-case text-on-surface-variant/70">
                (optional — one per line)
              </span>
            </p>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={
                "best protein for weight loss\nlow sugar whey protein\n…"
              }
              className={`${inputCls} min-h-40 resize-none `}
            />
          </div>

          <ErrorBanner message={error} />

          <div className="space-y-3">
            <RunButton
              onClick={generate}
              loading={generating}
              disabled={!productId}
              label="Generate Prompts →"
              loadingLabel="Generating…"
            />

            <button
              type="button"
              onClick={loadExisting}
              disabled={loadingExisting || !productId}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-outline-variant  px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low disabled:opacity-50"
            >
              {loadingExisting && <Loader2 className="h-4 w-4 animate-spin" />}
              {loadingExisting ? "Loading…" : "Reload Existing Prompts"}
            </button>
          </div>

          {planLimits && (
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                Plan limits
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface-container-highest px-3 py-2">
                  <p className="text-xs text-on-surface-variant">
                    Manual prompts / product
                  </p>
                  <p className="mt-1 font-semibold text-on-surface">
                    {planLimits.manualPromptsPerProduct ?? "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-container-highest px-3 py-2">
                  <p className="text-xs text-on-surface-variant">
                    Auto prompts / product
                  </p>
                  <p className="mt-1 font-semibold text-on-surface">
                    {planLimits.promptsPerProduct ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Results ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-on-surface">
                Generated prompts
              </p>
              <p className="text-xs text-on-surface-variant">
                New prompts scored for the selected product.
              </p>
            </div>
            <span className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface-variant">
              {generated?.length ?? 0} created
            </span>
          </div>

          {generated && Array.isArray(generated) && generated.length > 0 ? (
            <div className="space-y-3">
              {generated.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-outline-variant bg-surface-container-low p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {item.prompt}
                      </p>
                      <Link
                        to={`/app/promptwins/${item._id}`}
                        className="inline-flex items-center justify-center h-6 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 font-mono-sm text-[11px]
                         font-bold hover:bg-gray-200 hover:text-gray-900 transition-colors">
                        Detail
                      </Link>
                    </div>
                    <LikelihoodBadge value={item.visibility} />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2">
                    Score: <strong>{item.intentCoverageScore ?? "—"}</strong>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center text-sm text-on-surface-variant">
              {generating
                ? "Generating prompts…"
                : "Generated prompts will appear here after you run the workflow."}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-on-surface">
                Existing scored prompts
              </p>
              <p className="text-xs text-on-surface-variant">
                Prompts already scored for this product.
              </p>
            </div>
            <span className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface-variant">
              {existingPrompts.length}
            </span>
          </div>

          {loadingExisting ? (
            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center text-sm text-on-surface-variant">
              Loading existing prompts…
            </div>
          ) : existingPrompts.length > 0 ? (
            <div className="space-y-3">
              {existingPrompts.slice(0, 8).map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-outline-variant bg-surface-container-low p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {item.prompt}
                      </p>
                      <Link
                        to={`/app/promptwins/${item._id}`}
                        className="inline-flex items-center justify-center h-6 px-4 rounded-xl border border-gray-300 bg-gray-100 
                        text-gray-700 font-mono-sm text-[11px] font-bold hover:bg-gray-200 hover:text-gray-900 transition-colors">
                        Detail
                      </Link>
                    </div>
                    <LikelihoodBadge value={item.visibility} />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2">
                    Score: <strong>{item.intentCoverageScore ?? "—"}</strong>
                  </p>
                </div>
              ))}
              {existingPrompts.length > 8 && (
                <p className="text-xs text-center text-on-surface-variant pt-1">
                  +{existingPrompts.length - 8} more — reload to see latest
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center text-sm text-on-surface-variant">
              No existing prompts yet for this product.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
