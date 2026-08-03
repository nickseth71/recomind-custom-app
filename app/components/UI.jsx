// app/components/ui.jsx
// Shared design-system primitives for RecoMind product pages.
// Import everything from here in app.products.jsx and app.products_.$id.jsx
// to avoid duplication and keep colors consistent in one place.
//
// ── Color context cheat sheet (from tailwind.css tokens) ──────────────
// Page body bg:        #1b1b1f (dark)   -> body text default #e5e2e2
// .glass-card / cards: #f4e9d9 (light)  -> use on-surface / on-surface-variant (dark) text
// surface-container-low/highest: #fdf2e1 / #e3d9c8 (light) -> dark text
//
// RULE OF THUMB:
//  - Anything rendered directly on the page body (headers, tab bars,
//    back buttons) needs LIGHT text: text-surface / text-secondary-fixed-dim,
//    or should be wrapped in a glass-card pill so dark text works.
//  - Anything inside Card/SBox/glass-card needs DARK text:
//    text-on-surface / text-on-surface-variant / text-on-secondary-container.
//  - NEVER use text-on-primary-container (#dbe1ff) or
//    text-on-tertiary-container (#ffe08d) as TEXT on light card backgrounds
//    -- they're light colors meant for dark fills, and become invisible.
// ------------------------------------------------------------------------

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { X, ArrowLeft, CheckCircle2, Diamond } from "lucide-react";

/* ─── Layout primitives ─────────────────────────────────────────── */
export function Divider({ className = "" }) {
  return <div className={`border-t border-outline-variant ${className}`} />;
}

// light=true -> for use directly on the dark page body
export function Eyebrow({ children, className = "", light = false }) {
  const color = light ? "text-secondary-fixed-dim" : "text-on-surface-variant";
  return (
    <p
      className={`text-[10px] font-semibold tracking-[0.18em] uppercase font-mono-sm ${color} ${className}`}
    >
      {children}
    </p>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`glass-card rounded-2xl ${className}`}>{children}</div>
  );
}

export function CardHeader({ eyebrow, title, right, className = "" }) {
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

/* ─── Page chrome — designed for the DARK page body ────────────────── */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex justify-between items-end mb-2 gap-4 flex-wrap">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          {title}
        </h1>
        {subtitle && <p className="text-black mt-1 text-body-md">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// Glass pill back-link — has its own light background so dark text reads fine
// even though it sits on the dark page body.
export function BackLink({ to, children = "Back" }) {
  return (
    <Link
      to={to}
      className="glass-card flex items-center gap-1.5 px-3 py-2 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors font-mono-sm text-mono-sm font-semibold shrink-0 mt-0.5"
    >
      <ArrowLeft size={15} strokeWidth={2} />
      {children}
    </Link>
  );
}

// Pill-style tab row, wrapped in glass-card so active/inactive text always
// has a light background to sit on (matches the 30D/3M/6M selector pattern).
export function PillTabs({
  items,
  value,
  onChange,
  wrap = true,
  className = "",
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-1.5 flex gap-1 ${wrap ? "flex-wrap" : ""} ${className}`}
    >
      {items.map((item) => {
        const active = value === item.key;
        const Ico = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`flex items-center gap-1.5 px-2 py-2 rounded-xl font-mono-sm text-[12px] font-bold transition-all whitespace-nowrap ${
              active
                ? "bg-primary text-on-primary shadow-md"
                : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
            }`}
          >
            {Ico && <Ico size={14} strokeWidth={active ? 2 : 1.8} />}
            {item.label}
            {item.badge != null && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  active
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Score helpers (used both inside cards on light bg) ───────────── */
export function scoreColor(s) {
  if (s >= 70) return "#00e29e";
  if (s >= 40) return "#e9ba00";
  return "#ba1a1a";
}
export function scoreTextClass(s) {
  if (s >= 80) return "text-green-win";
  if (s >= 60) return "text-[#187bda]";
  if (s >= 40) return "text-on-tertiary-fixed-variant"; // dark brown-gold, readable on light bg
  return "text-error";
}
export function scoreBarClass(s) {
  if (s >= 80) return "bg-[#00e29e]";
  if (s >= 60) return "bg-[#187bda]";
  if (s >= 40) return "bg-[#e9ba00]";
  return "bg-error";
}
export function scoreLabel(s) {
  if (s >= 80) return "Optimal";
  if (s >= 60) return "Stable";
  if (s >= 40) return "At Risk";
  return "Critical";
}

/* ─── Semantic color trios — all DARK text on LIGHT tint, for use
   inside Card / SBox / glass-card backgrounds ──────────────────────── */
export function confColors(v) {
  if (v === "HIGH")
    return {
      text: "text-green-win",
      bg: "bg-[#00e29e]/12",
      border: "border-[#00e29e]/35",
    };
  if (v === "MEDIUM")
    return {
      text: "text-on-tertiary-fixed-variant",
      bg: "bg-tertiary-fixed/25",
      border: "border-tertiary-fixed/50",
    };
  return { text: "text-error", bg: "bg-error/10", border: "border-error/30" };
}
export const winProbColors = confColors;
export const impactColorsHL = confColors; // HIGH/MEDIUM/LOW scale, same trio

export function impactColors(v) {
  if (v === "HIGH")
    return { text: "text-error", bg: "bg-error/10", border: "border-error/30" };
  if (v === "MEDIUM")
    return {
      text: "text-on-tertiary-fixed-variant",
      bg: "bg-tertiary-fixed/25",
      border: "border-tertiary-fixed/50",
    };
  return {
    text: "text-on-surface-variant",
    bg: "bg-surface-container-highest",
    border: "border-outline-variant",
  };
}
export function effortColors(v) {
  if (v === "LOW")
    return {
      text: "text-green-win",
      bg: "bg-[#00e29e]/12",
      border: "border-[#00e29e]/35",
    };
  if (v === "MEDIUM")
    return {
      text: "text-on-tertiary-fixed-variant",
      bg: "bg-tertiary-fixed/25",
      border: "border-tertiary-fixed/50",
    };
  return { text: "text-error", bg: "bg-error/10", border: "border-error/30" };
}

/* ─── Status badge — fixed "Analysed" state (was light-on-light) ───── */
export function StatusBadge({ analysisScore, isOptimized }) {
  if (analysisScore == null)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-surface-container border-outline-variant text-on-surface-variant">
        Not Analysed
      </span>
    );
  if (isOptimized)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#00e29e]/12 border-[#00e29e]/35 text-green-win">
        <CheckCircle2 size={10} strokeWidth={2} />
        Optimised
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-tertiary-fixed/25 border-tertiary-fixed/50 text-on-tertiary-fixed-variant">
      <CheckCircle2 size={10} strokeWidth={2} />
      Analysed
    </span>
  );
}

/* ─── Chip — default dark-navy-on-light-lavender, readable on any
   light card background ─────────────────────────────────────────── */
export function Chip({
  text,
  colorClass = "text-on-secondary-container",
  bgClass = "bg-secondary-container/40",
  borderClass = "border-secondary/20",
}) {
  return (
    <span
      className={`inline-block font-mono-sm text-[11px] px-3 py-1 rounded-full m-1 border ${colorClass} ${bgClass} ${borderClass}`}
    >
      {text}
    </span>
  );
}

export function SBox({
  label,
  labelClass = "text-on-surface-variant",
  children,
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-3 ${labelClass}`}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

/* ─── Score bar (inside cards, light bg) ────────────────────────────── */
export function ScoreBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const col = pct >= 70 ? "#00e29e" : pct >= 40 ? "#e9ba00" : "#ba1a1a";
  return (
    <div className="h-1.5 rounded-full overflow-hidden bg-[#fff8f1] flex-1">
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: col,
          // transition: "width 0.8s ease",
        }}
      />
    </div>
  );
}

/* ─── Score rings ────────────────────────────────────────────────────── */
export function MiniScoreRing({ score, size = 72 }) {
  const r = size / 2 - 7,
    circ = 2 * Math.PI * r;
  // const fill = ((score ?? 0) / 100) * circ;
  const fill = ((score ?? 0) / 100) * circ;
  const offset = circ - fill;
  const col = scoreColor(score ?? 0);
  return (
    <div
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      {/* upper ring */}
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-outline-variant)"
          strokeWidth="4"
        />
        {/* <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth="5"
          // strokeDasharray={`${fill.toFixed(1)} ${circ.toFixed(1)}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          // style={{ filter: `drop-shadow(0 0 4px ${col})` }}
        /> */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth="2"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.2s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-mono-sm font-bold"
          style={{ color: col, fontSize: size < 60 ? 11 : 15 }}
        >
          {score ?? "-"}
        </span>
      </div>
    </div>
  );
}

export function ScoreRing({ score, size = 120 }) {
  const r = size / 2 - 10,
    circ = 2 * Math.PI * r;
  const fill = ((score ?? 0) / 100) * circ;
  const col = scoreColor(score ?? 0);
  return (
    <div
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-outline-variant)"
          strokeWidth="5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth="5"
          strokeDasharray={`${fill.toFixed(1)} ${circ.toFixed(1)}`}
          strokeLinecap="round"
          style={
            {
              // transition: "stroke-dasharray 1.2s ease",
              // filter: `drop-shadow(0 0 6px ${col})`,
            }
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none"
          style={{ color: col, fontSize: size < 80 ? 18 : 28 }}
        >
          {score ?? "-"}
        </span>
        <span className="font-mono-sm text-[10px] text-on-surface-variant mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}

/* ─── Product thumbnail ──────────────────────────────────────────────── */
export function ProductThumb({ images = [] }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const valid = (images || []).filter(Boolean);
  const isSlideshow = valid.length > 1;
  useEffect(() => {
    if (!isSlideshow) return;
    timerRef.current = setInterval(
      () => setIdx((i) => (i + 1) % valid.length),
      2000,
    );
    return () => clearInterval(timerRef.current);
  }, [isSlideshow, valid.length]);
  if (valid.length === 0)
    return (
      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 border border-outline-variant">
        <Diamond
          size={14}
          className="text-on-surface-variant"
          strokeWidth={1.8}
        />
      </div>
    );
  if (valid.length === 1)
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
    </div>
  );
}

/* ─── Modal — div-based (fixes invalid button-in-button nesting) ──────── */
export function Modal({ title, onClose, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className={`glass-card rounded-2xl w-full ${maxWidth} max-h-[90vh] scrollable-container`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <Divider />
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ─── Misc utilities ─────────────────────────────────────────────────── */
export function useDebounced(val, ms = 300) {
  const [d, setD] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setD(val), ms);
    return () => clearTimeout(t);
  }, [val, ms]);
  return d;
}

export function Toast({ msg, type }) {
  return (
    <div
      className={`fixed top-5 right-5 z-[60] px-5 py-3 rounded-xl text-sm font-bold shadow-2xl ${type === "error" ? "bg-error text-on-error" : "bg-green-win text-on-primary"}`}
    >
      {msg}
    </div>
  );
}

/* ─── Button ─────────────────────────────────────────────────────── */
export function Btn({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-primary text-on-primary hover:opacity-90 disabled:opacity-50",
    ghost:
      "bg-surface-container-low text-on-surface-variant border border-outline-variant",
    secondary:
      "bg-secondary-container text-on-secondary-container hover:opacity-90",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl text-[13px] font-bold font-mono-sm transition-all disabled:cursor-not-allowed ${
        variants[variant] || variants.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─── Badge — small colored pill, e.g. "JSON" / "Growth+" tags ─────── */
export function Badge({ text, color = "#187bda" }) {
  return (
    <span
      className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{
        color,
        background: `${color}1a`,
        border: `1px solid ${color}40`,
      }}
    >
      {text}
    </span>
  );
}

/* ─── Spinner ────────────────────────────────────────────────────── */
export function Spinner({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin shrink-0"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── StatCard — icon + label + value, sits in a Card ───────────────── */
export function StatCard({
  icon: Icon,
  label,
  value,
  unit = "",
  color = "#187bda",
}) {
  return (
    <Card>
      <div className="p-4 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${color}1a` }}
        >
          <Icon size={16} color={color} strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant truncate">
            {label}
          </p>
          <p className="text-[18px] font-bold text-on-surface leading-tight">
            {value}
            {unit && (
              <span className="text-[11px] font-semibold text-on-surface-variant ml-0.5">
                {unit}
              </span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}

export const BREAKDOWN_META = {
  productClarity: { label: "Product Clarity", max: 20 },
  audienceSignals: { label: "Audience Signals", max: 15 },
  useCaseDepth: { label: "Use-Case Depth", max: 20 },
  trustAndCredibility: { label: "Trust & Cred.", max: 15 },
  faqAndObjections: { label: "FAQ / Objections", max: 15 },
  promptReadiness: { label: "Prompt Readiness", max: 15 },
  faqQuality: { label: "FAQ Quality", max: 15 },
  useCaseClarity: { label: "Use-Case", max: 20 },
  comparisonReadiness: { label: "Comparison", max: 20 },
  intentAlignment: { label: "Intent Match", max: 20 },
  trustSignals: { label: "Trust Signals", max: 15 },
  conversationalReadability: { label: "Readability", max: 10 },
};

export const ENGINE_COLORS = {
  chatgpt: "#10a37f",
  perplexity: "#111844", // was --color-on-primary-container (#dbe1ff, too light) -> dark navy
  gemini: "#00875a", // darkened from #00e29e for label-text contrast on light tile
  aiOverview: "#187bda",
};
