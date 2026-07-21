// src/pages/simulate/SimulateHistory.jsx
import { LikelihoodBadge } from "./SimulateShared";

export default function SimulateHistory({ history }) {
  if (!history?.length) return null;

  return (
    <div
      className="rounded-2xl border border-outline-variant overflow-hidden"
      style={{ background: "var(--color-surface-container-low)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b border-outline-variant flex items-center justify-between"
        style={{ background: "var(--color-surface-container-highest)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Recent Simulations
        </p>
        <span className="text-xs text-on-surface-variant">{history.length} latest</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-outline-variant/50">
        {history.map((item) => (
          <div
            key={item._id}
            className="px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between hover:bg-surface-container-highest/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-on-surface truncate">
                "{item.prompt}"
              </p>
              <p className="text-xs text-on-surface-variant truncate mt-0.5">
                {item.productId?.title ?? item.productTitle ?? "Unknown product"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <LikelihoodBadge value={item.likelihood} />
              <span className="rounded-full border border-outline-variant bg-surface-container-highest px-3 py-1 text-sm font-bold text-on-surface tabular-nums">
                {item.recommendationScore ?? "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
