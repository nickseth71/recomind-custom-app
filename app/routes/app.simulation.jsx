// src/pages/Simulate.jsx  (or app/routes/app.simulate.jsx)
import { useState } from "react";
import { promptApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { PageHeader } from "../components/UI";

import ModeSimulate from "../components/simulate/ModeSimulate";
import ModeIntelligence from "../components/simulate/ModeIntelligence";
import ModeScore from "../components/simulate/ModeScore";
import ModeGenerate from "../components/simulate/ModeGenerate";
import SimulateHistory from "../components/simulate/SimulateHistory";

const MODES = [
  { key: "simulate", label: "Prompt Simulator" },
  { key: "intelligence", label: "Prompt Intelligence" },
  { key: "score", label: "Score Prompt" },
  { key: "generate", label: "Generate Prompts" },
];

export default function Simulate() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("recomind_token")
      : null;

  const [mode, setMode] = useState("simulate");

  const { data: historyRes, refetch: refetchHistory } = useApi(
    token ? () => promptApi.history({ limit: 8 }) : null,
    [token],
  );
  const history = historyRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Recommendation Simulator"
        subtitle="Test prompts against your catalog and discover intelligence-led recommendations."
      />

      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2">
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
              mode === key
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mode content — each mode owns its own state */}
      <div
        className="rounded-2xl border border-outline-variant p-6"
        style={{ background: "var(--color-surface-container-low)" }}
      >
        {mode === "simulate" && (
          <ModeSimulate
            token={token}
            history={history}
            refetchHistory={refetchHistory}
          />
        )}
        {mode === "intelligence" && <ModeIntelligence />}
        {mode === "score" && <ModeScore token={token} />}
        {mode === "generate" && <ModeGenerate token={token} />}
      </div>

      {/* Shared history — only shown on simulate mode where it's relevant */}
      {mode === "simulate" && <SimulateHistory history={history} />}
    </div>
  );
}
