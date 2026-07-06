// import { useState } from "react";
// import{ArrowRight} from "lucide-react"
// // import { CircularProgressbar } from "react-circular-progressbar";
// // import "react-circular-progressbar/dist/styles.css";
// const Promptwins = () => {
//   const [selected, setSelected] = useState("");
//   const score = 42;
//   const actions = [
//     "Add digestion benefit section",
//     "Add lactose-free claim",
//     "Add FAQ for bloating",
//   ];
//   return (
//     // 1st box

//     <div className="grid grid-cols-3 gap-3 p-3">
//       <div className="h-[190px] w-full glass-card rounded-xl p-4">
//         <span className="text-secondary-fixed-dim font-headline-sm font-bold uppercase text-body-md ml-4">
//           PROMPT
//         </span>
//         <br />
//         <span className="text-l font-bold text-black ml-4 mt-2 mb-3">
//           low bloating whey protein
//         </span>
//         <br />

//         <button
//           onClick={() => setSelected("commercial")}
//           className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
//             selected === "commercial"
//               ? "bg-[#0B1B5A] text-white border-[#0B1B5A]"
//               : "border-outline-variant text-on-surface-variant bg-surface-container ml-4 mt-3"
//           }`}
//         >
//           COMMERCIAL
//         </button>

//         <button
//           onClick={() => setSelected("high-intent")}
//           className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
//             selected === "high-intent"
//               ? "bg-[#0B1B5A] text-white border-[#0B1B5A]"
//               : "border-outline-variant text-on-surface-variant bg-surface-container ml-3 mt-3"
//           }`}
//         >
//           HIGH INTENT
//         </button>
//       </div>

//       {/* //2nd box */}

//       <div className="h-[190px] w-full glass-card rounded-xl p-3 ">
//         {/* <div className="flex items-center gap-6 mt-4"> */}
//         <span className="text-secondary-fixed-dim font-headline-sm font-bold uppercase text-body-md ml-4 ">
//           YOUR SCORE
//         </span>
//         <div className="flex items-center gap-3 mt-2 text-mono-sm ">
//           {/* Circle */}
//           <div className="relative w-24 h-24 shrink-0">
//             <div
//               className="w-full h-full rounded-full"
//               style={{
//                 background: `conic-gradient(#7B5800 0% ${score}%, #e3d9c8 ${score}% 100%)`,
//               }}
//             />

//             <div className="absolute inset-[8px] glass-card rounded-full flex flex-col items-center justify-center">
//               <span className="text-2xl font-bold text-[rgb(123,88,0)]">
//                 42
//               </span>
//               <span className="text-xs text-black">/100</span>
//             </div>
//           </div>

//           {/* Text */}
//           <div>
//             <h3 className="text-[rgb(123,88,0)] font-bold text-lg">IMPROVE</h3>

//             <p className="text-black text-xs mt-2">
//               You have some relevant content but missing important signals.
//             </p>
//           </div>
//         </div>
//       </div>
//       {/* //3rd box */}
//       <div className="h-[190px] w-full glass-card rounded-xl p-3">
//         <span className="text-secondary-fixed-dim font-headline-sm font-bold uppercase text-body-md ml-4">
//           AI VISIBILITY
//         </span>
//         {[
//           ["You", "42%", "42"],
//           ["DymatizeISO100", "81%", "81"],
//           ["NakedWhey", "79%", "79"],
//           ["Optimum Nutrition", "76%", "76"],
//         ].map(([label, percent, width]) => (
//           <div key={label} className="flex items-center justify-between">
//             <p className="text-black text-xs text-mono-sm">{label}</p>
//             <div className="h-[3px] w-[80px] bg-surface-container-highest rounded-full overflow-hidden">
//               <div
//                 className=" h-[3px] w-[80px] bg-[#15E5A5] rounded"
//                 style={{ width: `${width}%` }}
//               ></div>
//             </div>
//             <span className="text-black">{percent}</span>
//           </div>
//         ))}
//         <button className="mt-2 cursor-pointer inline-flex items-center text-on-surface text-mono-sm ">
//           View all recommendations <span ><ArrowRight size={10} className="text-on-surface" /></span></button>
//       </div>
//       {/* //4th box */}
//       <div className="h-[190px] w-full glass-card rounded-xl p-3">
//         <span className="text-on-surface font-headline-sm">
//           Why You're Not Ranking Higher
//         </span>
//         <p className="text-black text-mono-sm text-[10px]">
//           No mention of easy digestion or gut-friendly
//         </p>
//         <p className="text-[10px] text-black text-mono-sm">
//           No lactose-free or low-lactose claim
//         </p>
//         <p className="text-[10px] text-black text-mono-sm">
//           Missing keywords: bloating, digestive, gentle
//         </p>
//         <p className="text-[10px] text-black text-mono-sm">
//           No relevant FAQ addressing bloating
//         </p>
//         <p className="text-[10px] text-black text-mono-sm">
//           Limited social proof for sensitive stomach users
//         </p>
//       </div>
//       {/* //5th box */}
//       <div className="h-[190px] w-full glass-card rounded-xl p-3">
//         <p className="text-on-surface font-headline-sm ">What to Improve</p>
//         <p className="text-[10px] text-black text-mono-sm">
//           Add digestion-friendly and gut-health benefits
//         </p>
//         <p className="text-[10px] text-black text-mono-sm">
//           Include lactose-free or low-lactose information
//         </p>
//         <p className="text-[10px] text-black text-mono-sm">
//           Add FAQ about bloating and digestion
//         </p>
//         <p className="text-[10px] text-black text-mono-sm">
//           Add customer reviews for sensitive stomach
//         </p>
//         <p className="text-[10px] text-black text-mono-sm">
//           Include comparison with other gentle proteins
//         </p>
//       </div>
//       {/* //6th box */}
//       <div className="h-[190px] w-full glass-card rounded-xl p-3 flex flex-col">
//   <h3 className="text-on-surface font-headline-sm mb-3">
//     Recommended Actions
//   </h3>

//   <div className="flex-1 flex flex-col justify-between">
//     {actions.map((action) => (
//       <div
//         key={action}
//         className="flex items-center text-mono-sm justify-between"
//       >
//         {/* Action */}
//         <p className="text-black text-[11px] leading-none flex-1 pr-2">
//           {action}
//         </p>

//         {/* Badge + Button */}
//         <div className="flex items-center gap-2">
//           <span className="text-[8px] px-2 py-[2px] text-on-surface-variant rounded-xl transition-colors border border-outline-variant whitespace-nowrap">
//             High Impact
//           </span>

//           <button className="px-3 py-[2px] rounded-xl bg-primary text-white text-[10px] cursor-pointer whitespace-nowrap">
//             Fix Now
//           </button>
//         </div>

//       </div>
//     ))}

//   </div>
//          <button className="mt-2 cursor-pointer inline-flex items-center text-on-surface text-mono-sm ">View all recommendations <span ><ArrowRight size={10} className="text-on-surface" /></span></button>

// </div>
//       </div>
//     // </div>
//   );
// };

// export default Promptwins;

// app/routes/app.promptwin.jsx
// Prompt Win Dashboard — store-wide and per-product visibility
// Route: /app/promptwin
// Filename uses "promptwin" (no dot) so it's a SIBLING of app.products.jsx,
// not nested under it.

import { useState } from "react";
import { Link } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { promptApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Target,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ChevronRight,
  BarChart2,
  Eye,
  Loader2,
  RefreshCw,
  Filter,
} from "lucide-react";

// ─── Re-use shared design tokens from ui.jsx ─────────────────
import {
  Card,
  Divider,
  Eyebrow,
  PageHeader,
  SBox,
  Chip,
} from "../components/UI";
import { jwtDecode } from "jwt-decode";

export const loader = async () => null;

/* ─── Visibility helpers ────────────────────────────────────── */
// Score → colour trio on light glass-card background
function visColor(vis) {
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

function VisibilityPill({ vis }) {
  const c = visColor(vis);
  const Icon =
    vis === "HIGH" ? TrendingUp : vis === "MEDIUM" ? Minus : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono-sm text-[10px] font-bold border ${c.text} ${c.bg} ${c.border}`}
    >
      <Icon size={10} strokeWidth={2} />
      {vis === "HIGH" ? "Winning" : vis === "MEDIUM" ? "Improve" : "Missing"}
    </span>
  );
}

/* ─── Coverage ring — small visual summary ───────────────────── */
function CoverageRing({ counts = {} }) {
  const high = counts.HIGH || 0;
  const med = counts.MEDIUM || 0;
  const low = counts.LOW || 0;
  const total = high + med + low || 0;
  const size = 80,
    cx = 40,
    cy = 40,
    r = 32;
  const circ = 2 * Math.PI * r;

  // Three arcs: HIGH (green), MEDIUM (amber), LOW (red)
  const highArc = (high / total) * circ;
  const medArc = (med / total) * circ;
  const lowArc = (low / total) * circ;
  // Offsets: start from top (rotate svg -90deg)
  const medOffset = circ - highArc;
  const lowOffset = circ - highArc - medArc;

  return (
    <div
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-outline-variant)"
          strokeWidth="8"
        />
        {/* LOW (bottom layer) */}
        {low > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#ba1a1a"
            strokeWidth="8"
            strokeDasharray={`${lowArc.toFixed(1)} ${circ.toFixed(1)}`}
            strokeDashoffset={`${lowOffset.toFixed(1)}`}
            strokeLinecap="butt"
          />
        )}
        {/* MEDIUM */}
        {med > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#e9ba00"
            strokeWidth="8"
            strokeDasharray={`${medArc.toFixed(1)} ${circ.toFixed(1)}`}
            strokeDashoffset={`${medOffset.toFixed(1)}`}
            strokeLinecap="butt"
          />
        )}
        {/* HIGH (top layer, starts at 0) */}
        {high > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#00e29e"
            strokeWidth="8"
            strokeDasharray={`${highArc.toFixed(1)} ${circ.toFixed(1)}`}
            strokeLinecap="butt"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono-sm font-black text-[17px] text-on-surface leading-none">
          {total}
        </span>
        <span className="font-mono-sm text-[9px] text-on-surface-variant mt-0.5">
          prompts
        </span>
      </div>
    </div>
  );
}

/* ─── Stat tile ─────────────────────────────────────────────── */
function StatTile({
  label,
  value,
  sub,
  colorClass = "text-on-surface",
  accentLeft = "",
}) {
  return (
    <Card className={`flex items-center gap-4 px-5 py-4 ${accentLeft}`}>
      <div>
        <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className={`text-[28px] font-black leading-none ${colorClass}`}>
          {value}
        </p>
        {sub && (
          <p className="font-mono-sm text-[10px] text-on-surface-variant mt-1">
            {sub}
          </p>
        )}
      </div>
    </Card>
  );
}

/* ─── Prompt row ────────────────────────────────────────────── */
function PromptRow({ item }) {
  const [expanded, setExpanded] = useState(false);
  const c = visColor(item.visibility);

  return (
    <div
      className={`rounded-xl border bg-surface-container-low transition-all ${expanded ? "border-outline" : "border-outline-variant"}`}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
      >
        {/* Visibility dot */}
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
          {/* Coverage score */}
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
            className="text-primary font-semibold text-sm mr-2"
          >
            View
          </Link>
          <ChevronRight
            size={14}
            strokeWidth={2}
            className={`text-on-surface-variant transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {/* Expanded detail */}
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

/* ─── Prompt section (Missing / Improve / Winning) ──────────── */
function PromptSection({
  title,
  items = [],
  emptyMsg,
  accentColor = "text-on-surface-variant",
}) {
  if (items.length === 0)
    return (
      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low/50 px-5 py-8 text-center">
        <p className="font-mono-sm text-mono-sm text-on-surface-variant">
          {emptyMsg}
        </p>
      </div>
    );
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <PromptRow key={item._id} item={item} />
      ))}
    </div>
  );
}

/* ─── Plan limits bar ───────────────────────────────────────── */
function PlanBar({ limits, plan }) {
  if (!limits) return null;
  const tracked = limits.trackedCount ?? 0;
  const total = limits.totalTrackedPrompts;
  const pct = total ? Math.min(100, Math.round((tracked / total) * 100)) : null;

  return (
    <Card className="p-4 flex items-center gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <Eyebrow className="mb-1">Plan — {plan} </Eyebrow>
        <div className="flex items-center gap-4 flex-wrap text-[12px]">
          <span className="font-mono-sm text-on-surface-variant">
            <span className="font-bold text-on-surface">{tracked}</span>
            {total ? ` / ${total}` : ""} tracked prompts
          </span>
          <span className="font-mono-sm text-on-surface-variant">
            <span className="font-bold text-on-surface">
              {limits.promptsPerProduct}
            </span>{" "}
            auto / product
          </span>
          <span className="font-mono-sm text-on-surface-variant">
            Scan:{" "}
            <span className="font-bold text-on-surface capitalize">
              {limits.scanFrequency}
            </span>
          </span>
        </div>
        {pct !== null && (
          <div className="mt-2 h-[3px] w-full bg-surface-container-highest rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
      {!limits.promptTracking && (
        <span className="font-mono-sm text-[10px] px-2.5 py-1 rounded-full border border-outline-variant text-on-surface-variant bg-surface-container-highest">
          Tracking disabled on this plan
        </span>
      )}
    </Card>
  );
}

/* ═══ MAIN PAGE ════════════════════════════════════════════════ */
export default function PromptWinDashboard() {
  const token = localStorage.getItem("recomind_token");
  const decoded = jwtDecode(token);
  const plan = decoded.storePlan;

  //console.log("plan", plan);

  // Filters
  const [visFilter, setVisFilter] = useState("all"); // all | HIGH | MEDIUM | LOW
  const [activeTab, setActiveTab] = useState("missing"); // missing | improve | winning | recent

  // Fetch store-wide dashboard
  const {
    data: raw,
    loading,
    error,
    refetch,
  } = useApi(token ? () => promptApi.dashboard({}) : null, [token]);

  const dash = raw?.data ?? raw ?? {};
  const counts = dash.visibilityCounts ?? {};
  const limits = dash.planLimits ?? null;
  console.log("3. raw:", raw, "| loading:", loading, "| error:", error);
  // Derive real totals from arrays (don't trust summary object — can be stale)
  const missing = dash.topMissing ?? [];
  const improve = dash.topImprove ?? [];
  const winning = dash.topWinning ?? [];
  const recent = dash.recentPrompts ?? [];

  const totalMissing = missing.length;
  const totalImprove = improve.length;
  const totalWinning = winning.length;
  const totalAll = totalMissing + totalImprove + totalWinning;

  // Filter by visibility when "all recent" tab is active
  const filteredRecent =
    visFilter === "all"
      ? recent
      : recent.filter((p) => p.visibility === visFilter);

  // Tab config
  const tabs = [
    {
      key: "missing",
      label: "Missing",
      count: totalMissing,
      color: "text-error",
    },
    {
      key: "improve",
      label: "Improve",
      count: totalImprove,
      color: "text-on-tertiary-fixed-variant",
    },
    {
      key: "winning",
      label: "Winning",
      count: totalWinning,
      color: "text-green-win",
    },
    {
      key: "recent",
      label: "All Recent",
      count: recent.length,
      color: "text-on-surface-variant",
    },
  ];

  const tabItems = {
    missing: {
      items: missing,
      emptyMsg: "No missing-visibility prompts. Your coverage is solid.",
    },
    improve: {
      items: improve,
      emptyMsg: "No medium-visibility prompts right now.",
    },
    winning: {
      items: winning,
      emptyMsg: "No winning prompts yet — run an analysis first.",
    },
    recent: {
      items: filteredRecent,
      emptyMsg: "No recent prompts match this filter.",
    },
  };

  return (
    <div className="space-y-5">
      {/* Page header — on dark body, uses PageHeader from ui.jsx */}
      <PageHeader
        title="Prompt Win Dashboard"
        subtitle="See which buyer queries your products win, need improvement, or are missing from entirely."
        actions={
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-on-surface hover:brightness-95 transition-all disabled:opacity-50 font-label-md text-label-md"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" strokeWidth={1.8} />
            ) : (
              <RefreshCw size={15} strokeWidth={1.8} />
            )}
            Refresh
          </button>
        }
      />

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2
            size={40}
            className="animate-spin text-primary"
            strokeWidth={1.5}
          />
          <p className="font-mono-sm text-mono-sm text-secondary-fixed-dim">
            Loading prompt visibility data…
          </p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertTriangle size={48} className="text-error" strokeWidth={1.5} />
          <p className="text-error font-mono-sm text-mono-sm font-semibold">
            {error}
          </p>
          <button
            onClick={refetch}
            className="px-5 py-2.5 rounded-xl font-bold border border-error/40 bg-error/10 text-error hover:bg-error/20 transition-all font-mono-sm text-mono-sm"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Plan limits bar */}
          <PlanBar limits={limits} plan={plan} />

          {/* Summary stat row */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-5 flex items-center gap-4 col-span-1">
              <CoverageRing counts={counts} />
              <div>
                <Eyebrow className="mb-1">Coverage</Eyebrow>
                <p className="font-mono-sm text-[11px] text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-green-win">
                    {counts.HIGH ?? 0}
                  </span>{" "}
                  winning
                  <br />
                  <span className="font-bold text-on-tertiary-fixed-variant">
                    {counts.MEDIUM ?? 0}
                  </span>{" "}
                  improvable
                  <br />
                  <span className="font-bold text-error">
                    {counts.LOW ?? 0}
                  </span>{" "}
                  missing
                </p>
              </div>
            </Card>

            <StatTile
              label="Winning Prompts"
              value={totalWinning}
              sub="AI recommends your product"
              colorClass="text-green-win"
              accentLeft="border-l-2 border-l-[#00e29e]"
            />
            <StatTile
              label="Need Improvement"
              value={totalImprove}
              sub="Partially visible — fixable"
              colorClass="text-on-tertiary-fixed-variant"
              accentLeft="border-l-2 border-l-[#e9ba00]"
            />
            <StatTile
              label="Not Visible"
              value={totalMissing}
              sub="AI skips your product entirely"
              colorClass="text-error"
              accentLeft="border-l-2 border-l-error"
            />
          </div>

          {/* Empty state — no prompts at all */}
          {totalAll === 0 && recent.length === 0 && (
            <Card className="p-10 flex flex-col items-center gap-4 text-center">
              <Target
                size={52}
                className="text-on-surface-variant"
                strokeWidth={1.5}
              />
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                No prompt data yet
              </h3>
              <p className="font-mono-sm text-mono-sm text-on-surface-variant max-w-sm">
                Analyse a product first. The Prompt Win Dashboard will
                automatically track which buyer queries your products win,
                improve, or miss.
              </p>
              <Link
                to="/app/products"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-opacity font-mono-sm text-mono-sm"
              >
                <Zap size={15} strokeWidth={1.8} />
                Analyse Products
              </Link>
            </Card>
          )}

          {/* Main tab view */}
          {(totalAll > 0 || recent.length > 0) && (
            <Card className="overflow-hidden">
              {/* Tab bar */}
              <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-outline-variant/40 flex-wrap gap-3">
                <div className="flex gap-0">
                  {tabs.map(({ key, label, count, color }) => {
                    const active = activeTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-1.5 pb-3.5 px-4 font-mono-sm text-[12px] font-bold border-b-2 transition-all ${active ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
                      >
                        {label}
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-primary/20 text-primary" : "bg-surface-container-highest text-on-surface-variant"}`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Visibility filter — only shown on "All Recent" tab */}
                {/* {activeTab === "recent" && (
                  <div className="flex items-center gap-1.5 pb-3">
                    <Filter
                      size={12}
                      className="text-on-surface-variant"
                      strokeWidth={1.8}
                    />
                    {["all", "HIGH", "MEDIUM", "LOW"].map((v) => {
                      const labels = {
                        all: "All",
                        HIGH: "Winning",
                        MEDIUM: "Improve",
                        LOW: "Missing",
                      };
                      const active = visFilter === v;
                      return (
                        <button
                          key={v}
                          onClick={() => setVisFilter(v)}
                          className={`font-mono-sm text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${active ? "bg-primary text-on-primary border-primary" : "text-on-surface-variant border-outline-variant hover:text-on-surface"}`}
                        >
                          {labels[v]}
                        </button>
                      );
                    })}
                  </div>
                )} */}
              </div>

              {/* Tab content */}
              <div className="p-5">
                <PromptSection
                  title={tabs.find((t) => t.key === activeTab)?.label}
                  items={tabItems[activeTab]?.items ?? []}
                  emptyMsg={tabItems[activeTab]?.emptyMsg ?? "No data."}
                />
              </div>
            </Card>
          )}

          {/* Quick link to product-specific view hint */}
          {totalAll > 0 && (
            <Card className="p-5 flex items-center gap-4">
              <Eye
                size={20}
                className="text-secondary shrink-0"
                strokeWidth={1.8}
              />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-on-surface">
                  Product-specific prompt view
                </p>
                <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-0.5">
                  Click any product on the inventory page, then open the Smart
                  Prompts tab to see win/improve/missing filtered to that
                  product only.
                </p>
              </div>
              <Link
                to="/app/products"
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant rounded-xl font-mono-sm text-mono-sm text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
              >
                View Products <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
