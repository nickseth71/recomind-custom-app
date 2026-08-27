import { useState } from "react";
import { Link } from "react-router";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { Eyebrow, Chip } from "./UI";

/* ─── Visibility helpers ────────────────────────────────────── */
export function visColor(vis) {
  if (vis === "HIGH")
    return {
      text: "text-green-win",
      bg: "bg-[#00e29e]/12",
      border: "border-[#00e29e]/35",
      dot: "#00e29e",
    };
  if (vis === "MEDIUM")
    return {
      text: "text-on-tertiary-fixed-variant",
      bg: "bg-tertiary-fixed/25",
      border: "border-tertiary-fixed/50",
      dot: "#e9ba00",
    };
  return {
    text: "text-error",
    bg: "bg-error/10",
    border: "border-error/30",
    dot: "#ba1a1a",
  };
}

export function VisibilityPill({ vis }) {
  const c = visColor(vis);
  const Icon =
    vis === "HIGH" ? TrendingUp : vis === "MEDIUM" ? Minus : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono-sm text-[10px] font-bold border ${c.text} ${c.bg} ${c.border}`}
    >
      <Icon size={10} strokeWidth={2} />
      {vis === "HIGH" ? "Winning" : vis === "MEDIUM" ? "Improve" : "Losing"}
    </span>
  );
}

/* ─── Prompt row — expandable card with score, visibility, and fix detail ─── */
export default function PromptRow({ item }) {
  const [expanded, setExpanded] = useState(false);
  const c = visColor(item.visibility);

  return (
    <div
      className={`rounded-xl border bg-surface-container-low transition-all ${expanded ? "border-outline" : "border-outline-variant"}`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3 cursor-pointer"
      >
        <div
          className="mt-1 shrink-0 w-2 h-2 rounded-full"
          style={{ background: c.dot }}
        />

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-on-surface leading-snug line-clamp-2">
            "{item.prompt}"
          </p>
          {item.productId?.title && (
            <p className="font-mono-sm text-[10px] text-on-surface-variant mt-0.5 truncate">
              {item.productId.title}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <div className="text-right">
            <div className={`text-[18px] font-black leading-none ${c.text}`}>
              {item.intentCoverageScore ?? "—"}
            </div>
            <div className="font-mono-sm text-[9px] text-on-surface-variant">
              / 100
            </div>
          </div>
          <VisibilityPill vis={item.visibility} />
          <Link
            to={`/app/promptwins/${item._id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center h-6 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 font-mono-sm text-[11px] font-bold hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            Detail
          </Link>
          <ChevronRight
            size={14}
            strokeWidth={2}
            className={`text-on-surface-variant transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-outline-variant pt-3">
          {item.buyerIntent && (
            <div>
              <Eyebrow className="mb-1">Buyer Intent</Eyebrow>
              <p className="font-mono-sm text-mono-sm text-on-surface">
                {item.buyerIntent}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {item.matchedAttributes?.length > 0 && (
              <div>
                <Eyebrow className="mb-1.5 text-green-win">Matched</Eyebrow>
                <div className="flex flex-wrap">
                  {item.matchedAttributes.map((a) => (
                    <Chip
                      key={a}
                      text={a}
                      colorClass="text-green-win"
                      bgClass="bg-[#00e29e]/12"
                      borderClass="border-[#00e29e]/30"
                    />
                  ))}
                </div>
              </div>
            )}
            {item.missingSignals?.length > 0 && (
              <div>
                <Eyebrow className="mb-1.5 text-error">Missing</Eyebrow>
                <div className="flex flex-wrap">
                  {item.missingSignals.map((s) => (
                    <Chip
                      key={s}
                      text={s}
                      colorClass="text-error"
                      bgClass="bg-error/10"
                      borderClass="border-error/25"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {item.recommendations?.length > 0 && (
            <div className="rounded-xl bg-surface-container-highest border border-outline-variant p-3">
              <Eyebrow className="mb-2">Fix</Eyebrow>
              {item.recommendations.map((r, i) => (
                <div
                  key={i}
                  className="flex gap-2 py-1 font-mono-sm text-mono-sm text-on-surface border-b border-outline-variant/30 last:border-0"
                >
                  <span className="text-primary shrink-0">→</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {item.rankingFactors?.length > 0 && (
            <div className="rounded-xl bg-surface-container-highest border border-outline-variant p-3">
              <Eyebrow className="mb-2">Ranking Factors</Eyebrow>
              {item.rankingFactors.map((r, i) => (
                <div
                  key={i}
                  className="flex gap-2 py-1 font-mono-sm text-mono-sm text-on-surface border-b border-outline-variant/30 last:border-0"
                >
                  • {r}
                </div>
              ))}
            </div>
          )}

          {item.reasoning && (
            <p className="font-mono-sm text-[11px] font-semibold text-on-surface-variant">
              {item.reasoning}
            </p>
          )}

          {item.statusMessage && (
            <p className={`font-mono-sm text-[11px] font-semibold ${c.text}`}>
              {item.statusMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
