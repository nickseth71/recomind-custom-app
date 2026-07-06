// src/pages/simulate/SimulateShared.jsx
// Shared primitives used across all simulate sub-modes

import { Loader2 } from "lucide-react";

export const LIKELIHOOD_STYLES = {
  HIGH: {
    label: "Winning",
    className: "text-green-win bg-[#00e29e]/10 border border-[#00e29e]/25",
    icon: "✓",
  },
  MED: {
    label: "Improve",
    className:
      "text-on-tertiary-fixed-variant bg-tertiary-fixed/20 border border-tertiary-fixed/40",
    icon: "⚠",
  },
  LOW: {
    label: "Missing",
    className: "text-error bg-error/10 border border-error/25",
    icon: "✕",
  },
};

export function LikelihoodBadge({ value }) {
  const style = LIKELIHOOD_STYLES[value] || LIKELIHOOD_STYLES.LOW;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${style.className}`}
    >
      <span>{style.icon}</span>
      {style.label}
    </span>
  );
}

export function RunButton({ onClick, disabled, loading, label, loadingLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-error/30 bg-error/8 px-4 py-3 text-sm font-semibold text-error">
      ⚠ {message}
    </div>
  );
}

export function ResultCard({ label, children, labelColor = "text-on-surface-variant" }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5 space-y-2">
      <p className={`text-[10px] font-bold uppercase tracking-widest ${labelColor}`}>
        {label}
      </p>
      {children}
    </div>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ${className}`}>
      {children}
    </p>
  );
}

// Shared textarea style
export const inputCls =
  "w-full rounded-2xl border border-outline-variant bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50";

// Shared select style
export const selectCls =
  "w-full rounded-2xl border border-outline-variant bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer";
