import { useState, useEffect, useRef, useMemo } from "react";
import { useApi } from "../hooks/useApi";
import { productApi, storeApi } from "../lib/api";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useAuth } from "../context/Authcontext";

// ─── lucide-react — one named import per icon, fully tree-shakeable ──────────
import {
  // AI engine icons — professional, abstract, no "robot/toy" feel
  MessageSquare, // ChatGPT  — conversation / language model
  Compass, // Perplexity — navigation / discovery / search
  Layers, // Gemini — multi-modal stacked layers
  Globe2, // AI Overview — web-wide search surface
  // UI icons
  Package,
  CheckCircle2,
  TriangleAlert,
  Clock4,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  EyeOff,
  Trophy,
  Zap,
  Calendar,
  Diamond,
  Radar,
  CornerUpLeft,
  ShieldCheck,
  MoreHorizontal,
  Info,
  WandSparkles,
  Brain,
  BarChart2,
  Loader2,
  User,
  Wrench,
} from "lucide-react";

const ICON_MAP = {
  // engines
  ChatGPT: MessageSquare,
  Perplexity: Compass,
  GeminiIcon: Layers,
  ClaudeIcon: WandSparkles,
  Globe: Globe2,
  // ui
  Inventory: Package,
  CheckCircle: CheckCircle2,
  Warning: TriangleAlert,
  Pending: Clock4,
  TrendUp: TrendingUp,
  TrendFlat: Minus,
  TrendDown: TrendingDown,
  Eye,
  EyeOff,
  Trophy,
  Bolt: Zap,
  Calendar,
  Diamond,
  Radar,
  Reply: CornerUpLeft,
  Token: ShieldCheck,
  MoreHoriz: MoreHorizontal,
  Info,
  AutoFix: WandSparkles,
  Psychology: Brain,
  Analytics: BarChart2,
  Schedule: Clock4,
  Spinner: Loader2,
  Person: User,
  Wrench,
};

function Icon({ name, size = 16, className = "" }) {
  const Comp = ICON_MAP[name];
  if (!Comp) return null;
  const extraCls = name === "Spinner" ? "animate-spin" : "";
  return (
    <Comp
      size={size}
      className={`shrink-0 ${extraCls} ${className}`}
      strokeWidth={1.8}
    />
  );
}

/* ─── Product thumbnail: empty → icon, 1 img → static, 2+ → slideshow ── */
function ProductThumb({ images = [] }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const valid = images.filter(Boolean);
  const isSlideshow = valid.length > 1;

  useEffect(() => {
    if (!isSlideshow) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % valid.length);
    }, 2000);
    return () => clearInterval(timerRef.current);
  }, [isSlideshow, valid.length]);

  if (valid.length === 0) {
    return (
      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 border border-outline-variant">
        <Icon name="Diamond" size={16} className="text-on-surface-variant" />
      </div>
    );
  }

  if (valid.length === 1) {
    return (
      <div className="w-10 h-10 rounded-lg shrink-0 border border-outline-variant overflow-hidden bg-surface-container-highest">
        <img
          src={valid[0]}
          alt="product"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-lg shrink-0 border border-outline-variant overflow-hidden bg-surface-container-highest relative">
      {valid.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="product"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ))}
      <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
        {valid.map((_, i) => (
          <span
            key={i}
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 6 : 3,
              height: 3,
              background: i === idx ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Engine base config — identity only, colors rank-assigned at runtime ── */
const ENGINE_BASE = [
  { key: "chatgpt", label: "ChatGPT", sub: "GPT-4o", iconName: "ChatGPT" },
  {
    key: "perplexity",
    label: "Perplexity",
    sub: "AI Search",
    iconName: "Perplexity",
  },
  { key: "gemini", label: "Gemini", sub: "Google", iconName: "GeminiIcon" },
  {
    key: "claude",
    label: "Claude",
    sub: "Anthropic",
    iconName: "ClaudeIcon",
  },
  {
    key: "aiOverview",
    label: "AI Overview",
    sub: "Search SGE",
    iconName: "Globe",
  },
];

// Colors for the DYNAMIC (ranked) engines only — chatgpt/perplexity/gemini,
// plus claude when the plan includes it. Up to 4 possible ranks.
const ENGINE_RANK_COLORS = [
  {
    hex: "#00e29e",
    colorClass: "text-green-win",
    bgClass: "bg-[#00e29e]/10",
    borderClass: "border-[#00e29e]/20",
  },
  {
    hex: "#187bda",
    colorClass: "text-[#187bda]",
    bgClass: "bg-[#187bda]/10",
    borderClass: "border-[#187bda]/20",
  },
  {
    hex: "#7b5800",
    colorClass: "text-tertiary",
    bgClass: "bg-tertiary/10",
    borderClass: "border-tertiary/20",
  },
  {
    hex: "#c96442",
    colorClass: "text-[#c96442]",
    bgClass: "bg-[#c96442]/10",
    borderClass: "border-[#c96442]/20",
  },
];

// AI Overview is always pinned last with this exact color, regardless of
// how many dynamic engines precede it — it never participates in ranking,
// so its appearance must never shift just because Claude is or isn't
// present for a given plan.
const PINNED_ENGINE_COLOR = {
  hex: "#585e71",
  colorClass: "text-secondary",
  bgClass: "bg-secondary/10",
  borderClass: "border-secondary/20",
};

const VISIBILITY_CONFIG = {
  HIGH: {
    label: "Winning",
    iconName: "TrendUp",
    textClass: "text-green-win",
    badgeClass: "text-green-win bg-green-win/8 border-green-win/20",
    barClass: "bg-[#00e29e]",
  },
  MEDIUM: {
    label: "Partial",
    iconName: "TrendFlat",
    textClass: "text-tertiary",
    badgeClass: "text-tertiary bg-tertiary/8 border-tertiary/20",
    barClass: "bg-tertiary",
  },
  LOW: {
    label: "Missing",
    iconName: "TrendDown",
    textClass: "text-error",
    badgeClass: "text-error bg-error/8 border-error/20",
    barClass: "bg-error",
  },
};

const CONF_CONFIG = {
  HIGH: { label: "High", dot: "bg-[#00e29e]", text: "text-green-win" },
  MEDIUM: {
    label: "Medium",
    dot: "bg-on-tertiary-container",
    text: "text-on-tertiary-container",
  },
  LOW: { label: "Low", dot: "bg-error", text: "text-error" },
  UNKNOWN: {
    label: "—",
    dot: "bg-outline-variant",
    text: "text-on-surface-variant",
  },
};

/* ─── Helpers ────────────────────────────────────────────────────── */
function scoreAppearance(s) {
  if (s >= 80) return { bar: "bg-[#00e29e]", text: "text-green-win" };
  if (s >= 60) return { bar: "bg-[#187bda]", text: "text-[#187bda]" };
  if (s >= 40)
    return {
      bar: "bg-on-tertiary-container",
      text: "text-on-tertiary-container",
    };
  return { bar: "bg-error", text: "text-error" };
}

const readinessLabel = (s) =>
  s >= 80 ? "Excellent" : s >= 60 ? "High" : s >= 40 ? "Moderate" : "Low";
const marketPos = (s) =>
  s >= 90 ? "Top 5%" : s >= 80 ? "Top 10%" : s >= 70 ? "Top 20%" : "Top 40%";

/* ─── Primitives ─────────────────────────────────────────────────── */
function Divider({ className = "" }) {
  return <div className={`border-t border-outline-variant ${className}`} />;
}
function Eyebrow({ children }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-on-surface-variant font-mono-sm">
      {children}
    </p>
  );
}
function Card({ children, className = "" }) {
  return (
    <div className={`glass-card rounded-2xl ${className}`}>{children}</div>
  );
}
function CardHeader({ eyebrow, title, right, className = "" }) {
  return (
    <div
      className={`flex items-start justify-between px-6 pt-5 pb-4 ${className}`}
    >
      <div className="flex flex-col gap-0.5">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          {title}
        </h3>
      </div>
      {right && <div className="shrink-0 mt-0.5">{right}</div>}
    </div>
  );
}

/* ─── ScoreRing ──────────────────────────────────────────────────── */
function ScoreRing({ score, size = 192, stroke = 10 }) {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const cx = size / 2;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="transparent"
          className="text-surface-container-highest"
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="transparent"
          stroke="#00e29e"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center select-none">
        <span className="font-display-lg text-[52px] font-bold leading-none text-on-surface">
          {score}
        </span>
        <span className="font-mono-sm text-mono-sm text-on-surface-variant uppercase tracking-widest mt-1">
          Score
        </span>
      </div>
    </div>
  );
}

/* ─── TokenRing ──────────────────────────────────────────────────── */
function TokenRing({ pct }) {
  const r = 26,
    c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg
      width="64"
      height="64"
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="transparent"
        className="text-surface-container-highest"
        stroke="currentColor"
        strokeWidth={5}
      />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="transparent"
        stroke={pct > 80 ? "var(--color-error)" : "#00e29e"}
        strokeWidth={5}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

/* ─── EngineRow ──────────────────────────────────────────────────── */
const RANK_LABELS = ["#1", "#2", "#3", "SGE"];

function EngineRow({ engine, value, loading, rank }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <span
            className="font-mono-sm text-[9px] font-bold w-5 text-center shrink-0"
            style={{ color: engine.hex }}
          >
            {RANK_LABELS[rank]}
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${engine.bgClass} ${engine.borderClass}`}
          >
            <Icon
              name={engine.iconName}
              size={14}
              className={engine.colorClass}
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[13px] font-semibold text-on-surface">
              {engine.label}
            </span>
            <span className="font-mono-sm text-mono-sm text-on-surface-variant">
              {engine.sub}
            </span>
          </div>
        </div>
        <span
          className={`font-mono-sm text-mono-sm font-semibold ${engine.colorClass}`}
        >
          {loading ? "—" : `${value}%`}
        </span>
      </div>
      <div className="h-[3px] w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: loading ? "0%" : `${value}%`,
            background: engine.hex,
          }}
        />
      </div>
    </div>
  );
}

/* ─── PromptRow ──────────────────────────────────────────────────── */
function PromptRow({ item }) {
  const vis = VISIBILITY_CONFIG[item.visibility] || VISIBILITY_CONFIG.MEDIUM;
  const score = item.intentCoverageScore ?? 0;
  return (
    <div className="flex items-start gap-3 px-6 py-4 hover:bg-surface-container-low/60 transition-colors border-b border-outline-variant last:border-0">
      <Icon
        name={vis.iconName}
        size={16}
        className={`mt-0.5 shrink-0 ${vis.textClass}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-on-surface truncate">
          {item.prompt}
        </p>
        <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-0.5 truncate">
          {item.buyerIntent}
        </p>
        {item.missingSignals?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.missingSignals.map((s) => (
              <span
                key={s}
                className="px-1.5 py-0.5 text-[10px] rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant font-mono-sm"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold font-mono-sm ${vis.badgeClass}`}
        >
          {vis.label}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-14 h-[3px] bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${vis.barClass}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="font-mono-sm text-[10px] text-on-surface-variant">
            {score}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export const loader = async () => null;

export default function Index() {
  const [timePeriod, setTimePeriod] = useState("30d");
  const [promptTab, setPromptTab] = useState("missing");
  const { token } = useAuth();

  // Store/plan NAME only, decoupled from the period toggle — this is what
  // fixes the tab flash: previously availablePeriods derived from the
  // period-scoped dashboard response's `plan`, which gets cleared to null
  // on every period click while the new fetch is in flight, briefly
  // collapsing the tab list to its single-item fallback. The plan name
  // doesn't change when you switch time periods, so it shouldn't be
  // re-fetched (or wiped) when you do. Everything else that reads the
  // fuller `plan` object below (limits, tokenQuota, config.tagline) still
  // comes from the dashboard response as before — this is purely for the
  // tab list.
  const { data: storeResponse } = useApi(
    token ? () => storeApi.getMe() : null,
    [token],
  );
  const accountPlanName = (storeResponse?.data?.plan || "").toLowerCase();

  const {
    data: dashboardResponse,
    loading,
    error,
  } = useApi(
    token
      ? () =>
          productApi.getDashboard(timePeriod === "30d" ? {} : { timePeriod })
      : null,
    [token, timePeriod],
  );

  const stats = dashboardResponse?.data ?? dashboardResponse ?? {};
  const aiScore = stats?.avgAiScore ?? 0;
  const coverage = stats?.aiEngineCoverage ?? {};
  const recentAnalyses = stats?.recentAnalyses ?? [];
  const promptWin = stats?.promptWin ?? {};
  const plan = stats?.plan ?? {};
  const tokenQuota = plan?.tokenQuota ?? {};
  const promptSummary = promptWin?.summary ?? {};

  const tableProducts = recentAnalyses
    .slice()
    .sort((a, b) => a.score - b.score);
  const criticalCount = recentAnalyses.filter((i) => i.score < 60).length;

  // 3-tab prompt switching (matches doc 9 exactly)
  const promptItems =
    promptTab === "missing"
      ? (promptWin?.topMissing ?? [])
      : promptTab === "improve"
        ? (promptWin?.topImprove ?? [])
        : (promptWin?.topWinning ?? []);

  const tokenUsedPct = tokenQuota.monthly
    ? Math.round(((tokenQuota.used ?? 0) / tokenQuota.monthly) * 100)
    : 0;

  const statusColor = loading
    ? "bg-on-tertiary-container"
    : error
      ? "bg-error"
      : "bg-[#00e29e]";

  // Sort top engines by coverage desc; pin aiOverview last. Claude only
  // appears when the store's plan includes it — the backend omits the key
  // entirely for Starter, so coverage.claude is undefined there and this
  // filters it out with zero visual change for those merchants.
  const sortedEngines = useMemo(() => {
    const pinned = ENGINE_BASE.find((e) => e.key === "aiOverview");
    const dynamic = ENGINE_BASE.filter(
      (e) =>
        e.key !== "aiOverview" &&
        (e.key !== "claude" || coverage.claude != null),
    );
    const sorted = dynamic
      .map((e) => ({ ...e, value: coverage[e.key] ?? 0 }))
      .sort((a, b) => b.value - a.value)
      .map((e, rank) => ({ ...e, ...ENGINE_RANK_COLORS[rank] }));
    return [
      ...sorted,
      {
        ...pinned,
        value: coverage["aiOverview"] ?? 0,
        ...PINNED_ENGINE_COLOR,
      },
    ];
  }, [coverage]);

  const availablePeriods = useMemo(() => {
    const planName = accountPlanName;

    if (planName === "starter") {
      return [{ value: "30d", label: "30D" }];
    }

    if (planName === "growth") {
      return [
        { value: "30d", label: "30D" },
        { value: "3months", label: "3M" },
      ];
    }

    if (planName === "pro") {
      return [
        { value: "30d", label: "30D" },
        { value: "3months", label: "3M" },
        { value: "6months", label: "6M" },
      ];
    }

    // fallback — still shown while accountPlanName hasn't loaded yet
    return [{ value: "30d", label: "30D" }];
  }, [accountPlanName]);

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${statusColor} ${!loading && !error ? "animate-pulse" : ""}`}
            />
            <Eyebrow>
              {loading
                ? "Syncing data…"
                : error
                  ? "Connection error"
                  : "Live · All systems nominal"}
            </Eyebrow>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            AI Visibility Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card rounded-xl p-1 flex">
            {availablePeriods.map((period) => (
              <button
                key={period.value}
                onClick={() => setTimePeriod(period.value)}
                className={`
        px-4 py-2 rounded-lg text-[12px] font-semibold transition-all
        ${
          timePeriod === period.value
            ? "bg-primary text-on-primary shadow-md"
            : "text-on-surface-variant hover:text-on-surface"
        }
      `}
              >
                {period.label}
              </button>
            ))}
          </div>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-[13px] font-semibold hover:opacity-90 transition-opacity">
            <Icon name="Bolt" size={14} className="text-on-primary" />
            Simulate
          </button> */}
        </div>
      </div>

      {/* ── Row 1: Score · Coverage · Quick stats ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Score card */}
        <Card className="col-span-4 flex flex-col">
          <CardHeader eyebrow="Readiness" title="Overall AI Score" />
          <Divider />
          <div className="flex flex-col items-center py-7 px-6 gap-6">
            {loading ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <Icon
                  name="Spinner"
                  size={40}
                  className="text-on-surface-variant"
                />
              </div>
            ) : (
              <ScoreRing score={aiScore} />
            )}
            <div className="grid grid-cols-2 w-full gap-px bg-outline-variant rounded-xl overflow-hidden">
              {[
                {
                  label: "Clarity",
                  value: readinessLabel(aiScore),
                  cls: "text-green-win",
                },
                {
                  label: "Market",
                  value: marketPos(aiScore),
                  cls: "text-[#187bda]",
                },
              ].map(({ label, value, cls }) => (
                <div key={label} className="bg-surface-container-low px-4 py-3">
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {label}
                  </p>
                  <p
                    className={`font-headline-sm text-[15px] font-bold mt-0.5 ${cls}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Engine coverage */}
        <Card className="col-span-5 flex flex-col">
          <CardHeader
            eyebrow="Discovery"
            title="Engine Coverage"
            right={
              <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                <Icon name="MoreHoriz" size={18} />
              </button>
            }
          />
          <Divider />
          <div className="flex flex-col gap-5 px-6 py-5 flex-1">
            {sortedEngines.map((engine, rank) => (
              <EngineRow
                key={engine.key}
                engine={engine}
                value={engine.value}
                loading={loading}
                rank={rank}
              />
            ))}
          </div>
          <Divider />
          <p className="px-6 py-3 font-mono-sm text-mono-sm text-on-surface-variant flex items-center gap-1.5">
            <Icon name="Info" size={12} className="text-on-surface-variant" />
            500+ daily synthetic queries
            {coverage.period && (
              <span className="text-secondary font-semibold capitalize ml-1">
                · {coverage.period}
              </span>
            )}
          </p>
        </Card>

        {/* Quick stat tiles */}
        <div className="col-span-3 flex flex-col gap-4">
          {[
            {
              iconName: "Inventory",
              label: "Total Products",
              value: stats.totalProducts ?? 0,
              iconCls: "text-on-surface-variant",
              tileCls: "",
            },
            {
              iconName: "CheckCircle",
              label: "Optimised",
              value: stats.optimisedProducts ?? 0,
              iconCls: "text-green-win",
              tileCls: "border-l-2 border-l-[#00e29e]",
            },
            {
              iconName: "Warning",
              label: "Critical",
              value: stats.criticalProducts ?? 0,
              iconCls: "text-error",
              tileCls: "border-l-2 border-l-error",
            },
          ].map(({ iconName, label, value, iconCls, tileCls }) => (
            <Card
              key={label}
              className={`flex-1 flex items-center gap-4 px-5 py-4 ${tileCls}`}
            >
              <Icon
                name={iconName}
                size={20}
                className={`shrink-0 ${iconCls}`}
              />
              <div>
                <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-wide">
                  {label}
                </p>
                <p className="font-display-lg text-[26px] font-bold leading-none text-on-surface mt-0.5">
                  {loading ? "—" : value}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Row 2: Prompt Win + Plan sidebar ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Prompt Win */}
        <Card className="col-span-8 flex flex-col overflow-hidden">
          <div className="flex items-start justify-between px-6 pt-5 pb-4">
            <div className="flex items-center gap-2.5">
              <Icon name="Psychology" size={18} className="text-secondary" />
              <div>
                <Eyebrow>Intent Intelligence</Eyebrow>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                  Prompt Win Analysis
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[
                {
                  key: "canWin",
                  label: "winning",
                  textColor: "text-green-win",
                  bgColor: "bg-green-win/8",
                  borderColor: "border-green-win/20",
                },
                {
                  key: "improve",
                  label: "improve",
                  textColor: "text-tertiary",
                  bgColor: "bg-tertiary/8",
                  borderColor: "border-tertiary/20",
                },
                {
                  key: "missing",
                  label: "missing",
                  textColor: "text-error",
                  bgColor: "bg-error/8",
                  borderColor: "border-error/20",
                },
              ].map(({ key, label, textColor, bgColor, borderColor }) => (
                <div
                  key={key}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border font-mono-sm ${textColor} ${bgColor} ${borderColor}`}
                >
                  <span className="text-[14px] font-bold leading-none">
                    {promptSummary[key] ?? 0}
                  </span>
                  <span className="text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <Divider />

          {/* 3 tabs — matches doc 9 exactly */}
          <div className="flex gap-1 px-6 pt-3">
            {[
              { id: "missing", label: "Missing Intents", iconName: "EyeOff" },
              {
                id: "improve",
                label: "Needs Improvement",
                iconName: "TrendFlat",
              },
              { id: "winning", label: "Winning Prompts", iconName: "Trophy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPromptTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono-sm text-[11px] font-semibold transition-all ${
                  promptTab === tab.id
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <Icon name={tab.iconName} size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 mt-3 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Icon
                  name="Spinner"
                  size={24}
                  className="text-on-surface-variant"
                />
              </div>
            ) : promptItems.length === 0 ? (
              <div className="py-10 text-center font-mono-sm text-mono-sm text-on-surface-variant">
                No data for this period.
              </div>
            ) : (
              promptItems.map((item) => (
                <PromptRow key={item._id} item={item} />
              ))
            )}
          </div>

          <Divider />
          <p className="px-6 py-3 font-mono-sm text-mono-sm text-on-surface-variant flex items-center gap-1.5">
            <Icon name="Info" size={12} className="text-on-surface-variant" />
            {promptSummary.total ?? 0} prompts tracked across{" "}
            {stats.totalProducts ?? 0} products
            {plan?.limits?.scanFrequency && (
              <span className="text-on-surface font-semibold ml-1">
                · {plan.limits.scanFrequency} scans
              </span>
            )}
          </p>
        </Card>

        {/* Plan + Token column */}
        <div className="col-span-4 flex flex-col gap-4">
          {/* Plan card */}
          <Card>
            <CardHeader
              eyebrow="Subscription"
              title={plan?.config?.label ?? plan?.name ?? "Starter"}
              right={
                <span className="px-2 py-0.5 rounded-full font-mono-sm text-[10px] font-bold bg-green-win/10 text-green-win border border-green-win/20">
                  Active
                </span>
              }
            />
            <Divider />
            {plan?.config?.tagline && (
              <p className="px-6 pt-3 font-mono-sm text-mono-sm text-on-surface-variant">
                {plan.config.tagline}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 p-4">
              {[
                {
                  iconName: "Inventory",
                  label: "Products",
                  value: `${stats.totalProducts ?? 0} / ${plan?.limits?.maxProductsAnalyzed ?? "—"}`,
                },
                {
                  iconName: "AutoFix",
                  label: "Optimised",
                  value: stats.optimisedProducts ?? 0,
                },
                {
                  iconName: "Radar",
                  label: "Scan freq.",
                  value: plan?.limits?.scanFrequency ?? "—",
                },
                {
                  iconName: "Reply",
                  label: "Prompts/product",
                  value: plan?.limits?.promptsPerProduct ?? "—",
                },
              ].map(({ iconName, label, value }) => (
                <div
                  key={label}
                  className="bg-surface-container-low rounded-xl px-3 py-2.5"
                >
                  <div className="flex items-center gap-1 font-mono-sm text-[10px] text-on-surface-variant mb-1 uppercase tracking-wide">
                    <Icon
                      name={iconName}
                      size={11}
                      className="text-on-surface-variant"
                    />
                    {label}
                  </div>
                  <p className="text-[13px] font-bold text-on-surface capitalize truncate">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Token quota card */}
          <Card className="flex flex-col flex-1">
            <CardHeader
              eyebrow="Usage"
              title="Token Quota"
              right={
                <Icon
                  name="Token"
                  size={16}
                  className="text-on-surface-variant"
                />
              }
            />
            <Divider />
            <div className="px-6 py-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <TokenRing pct={tokenUsedPct} />
                <div>
                  <p className="font-display-lg text-[28px] font-bold leading-none text-on-surface">
                    {tokenUsedPct}%
                  </p>
                  <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-1">
                    used this month
                  </p>
                  {tokenUsedPct > 80 && (
                    <p className="font-mono-sm text-[10px] text-error font-semibold mt-1">
                      Near limit · consider upgrading
                    </p>
                  )}
                </div>
              </div>
              <div className="divide-y divide-outline-variant">
                {[
                  {
                    label: "Monthly quota",
                    value: (tokenQuota.monthly ?? 0).toLocaleString(),
                    cls: "text-on-surface",
                  },
                  {
                    label: "Used",
                    value: (tokenQuota.used ?? 0).toLocaleString(),
                    cls: "text-error",
                  },
                  {
                    label: "Remaining",
                    value: (tokenQuota.remaining ?? 0).toLocaleString(),
                    cls: "text-green-win",
                  },
                ].map(({ label, value, cls }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2.5"
                  >
                    <span className="font-mono-sm text-mono-sm text-on-surface-variant">
                      {label}
                    </span>
                    <span
                      className={`font-mono-sm text-mono-sm font-bold ${cls}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Row 3: Product breakdown ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            iconName: "Inventory",
            label: "Total",
            value: stats.totalProducts ?? 0,
            iconCls: "text-on-surface-variant",
            sub: "all products",
            accent: "",
          },
          {
            iconName: "CheckCircle",
            label: "Good",
            value: stats.goodProducts ?? 0,
            iconCls: "text-green-win",
            sub: "score 80+",
            accent: "border-l-2 border-l-[#00e29e]",
          },
          {
            iconName: "Pending",
            label: "Moderate",
            value: stats.moderateProducts ?? 0,
            iconCls: "text-tertiary",
            sub: "score 40–79",
            accent: "border-l-2 border-l-tertiary",
          },
          {
            iconName: "Warning",
            label: "Critical",
            value: stats.criticalProducts ?? 0,
            iconCls: "text-error",
            sub: "score <40",
            accent: "border-l-2 border-l-error",
          },
        ].map(({ iconName, label, value, iconCls, sub, accent = "" }) => (
          <Card
            key={label}
            className={`flex items-center gap-4 px-5 py-4 ${accent}`}
          >
            <Icon name={iconName} size={20} className={`shrink-0 ${iconCls}`} />
            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-display-lg text-[24px] font-bold leading-none text-on-surface">
                  {loading ? "—" : value}
                </p>
                <p
                  className={`font-mono-sm text-[10px] font-semibold uppercase tracking-wide ${iconCls}`}
                >
                  {label}
                </p>
              </div>
              <p className="font-mono-sm text-[10px] text-on-surface-variant mt-0.5">
                {sub}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Row 4: Analyses table — 7 columns matching doc 9 exactly ── */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Icon
              name={criticalCount > 0 ? "Warning" : "Analytics"}
              size={18}
              className={
                criticalCount > 0 ? "text-error" : "text-on-surface-variant"
              }
            />
            <div>
              <Eyebrow>Products</Eyebrow>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                {criticalCount > 0 ? "Needs Attention" : "Recent Analyses"}
              </h3>
            </div>
          </div>
          <button className="font-mono-sm text-mono-sm font-semibold text-secondary hover:underline">
            View all →
          </button>
        </div>
        <Divider />
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low">
              {[
                "Product",
                "Best For",
                "Score",
                "Buyer Profile",
                "Fixes",
                "Shopify",
                "",
              ].map((h, i) => (
                <th
                  key={h || i}
                  className={`px-4 py-3 font-mono-sm text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.12em] ${i === 6 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center text-on-surface-variant">
                    <Icon name="Spinner" size={24} />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center font-mono-sm text-mono-sm text-error"
                >
                  Failed to load — please refresh.
                </td>
              </tr>
            ) : tableProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center font-mono-sm text-mono-sm text-on-surface-variant"
                >
                  No analyses yet. Analyse a product to get started.
                </td>
              </tr>
            ) : (
              tableProducts.map((item) => {
                const score = item.score ?? 0;
                const { bar, text } = scoreAppearance(score);
                const title =
                  item.productId?.title ?? item.productTitle ?? "Untitled";
                const bestFor = (item.bestFor ?? []).slice(0, 2).join(", ");
                const conf = CONF_CONFIG[item.interpretationConf || "UNKNOWN"];

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    {/* Product */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <ProductThumb images={item.images ?? []} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-on-surface line-clamp-1 max-w-[160px] leading-snug">
                            {title}
                          </p>
                          {item.productCategory && (
                            <p className="font-mono-sm text-[10px] text-on-surface-variant mt-0.5 truncate max-w-[160px]">
                              {item.productCategory}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Best For */}
                    <td className="px-4 py-4">
                      <p className="font-mono-sm text-mono-sm text-on-surface-variant max-w-[130px] truncate">
                        {bestFor || "—"}
                      </p>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-[3px] bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${bar}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono-sm text-mono-sm font-bold ${text}`}
                        >
                          {score}
                        </span>
                      </div>
                    </td>

                    {/* Buyer Profile */}
                    <td className="px-4 py-4">
                      {item.primaryBuyer ? (
                        <div className="flex items-start gap-1.5 max-w-[150px]">
                          <Icon
                            name="Person"
                            size={11}
                            className="text-on-surface-variant shrink-0 mt-0.5"
                          />
                          <p className="font-mono-sm text-[10px] text-on-surface-variant line-clamp-2 leading-relaxed">
                            {item.primaryBuyer}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${conf.dot}`}
                          />
                          <span
                            className={`font-mono-sm text-[10px] font-semibold ${conf.text}`}
                          >
                            {conf.label} conf.
                          </span>
                        </div>
                      )}
                    </td>

                    {/* High-impact fixes */}
                    <td className="px-4 py-4">
                      {item.highImpactFixes > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Icon
                            name="Wrench"
                            size={11}
                            className="text-error shrink-0"
                          />
                          <span className="font-mono-sm text-[10px] font-bold text-error">
                            {item.highImpactFixes} high
                          </span>
                          {item.totalFixes > item.highImpactFixes && (
                            <span className="font-mono-sm text-[10px] text-on-surface-variant">
                              +{item.totalFixes - item.highImpactFixes}
                            </span>
                          )}
                        </div>
                      ) : item.totalFixes > 0 ? (
                        <span className="font-mono-sm text-[10px] text-on-surface-variant">
                          {item.totalFixes} fixes
                        </span>
                      ) : (
                        <span className="font-mono-sm text-[10px] text-on-surface-variant">
                          —
                        </span>
                      )}
                    </td>

                    {/* Shopify status */}
                    <td className="px-4 py-4">
                      <span
                        className={`flex items-center gap-1.5 font-mono-sm text-[11px] font-semibold ${item.appliedToShopify ? "text-green-win" : "text-on-surface-variant"}`}
                      >
                        <Icon
                          name={
                            item.appliedToShopify ? "CheckCircle" : "Schedule"
                          }
                          size={13}
                          className={
                            item.appliedToShopify
                              ? "text-green-win"
                              : "text-on-surface-variant"
                          }
                        />
                        {item.appliedToShopify ? "Applied" : "Pending"}
                      </span>
                    </td>

                    {/* Action */}
                    {/* <td className="px-4 py-4 text-right">
                      <button className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-mono-sm text-[11px] font-semibold hover:opacity-90 transition-opacity">
                        Optimize
                      </button>
                    </td> */}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <Divider />
        <p className="px-6 py-3 font-mono-sm text-mono-sm text-on-surface-variant">
          {stats.totalProducts
            ? `${stats.optimisedProducts ?? 0} of ${stats.totalProducts} optimised · ${stats.goodProducts ?? 0} good · ${stats.moderateProducts ?? 0} moderate · ${stats.criticalProducts ?? 0} critical`
            : "Run analysis on your products to populate this table."}
        </p>
      </Card>
    </div>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
