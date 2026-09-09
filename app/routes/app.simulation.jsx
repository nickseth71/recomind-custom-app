// src/pages/Simulate.jsx  (or app/routes/app.simulate.jsx)
import { useState } from "react";
import { promptApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { PageHeader } from "../components/UI";
import { useAuth } from "../context/Authcontext";
import AiSpinner from "../components/loader/AiSpinner";

import ModeSimulate from "../components/simulate/ModeSimulate";
import ModeIntelligence from "../components/simulate/ModeIntelligence";
import ModeScore from "../components/simulate/ModeScore";
import ModeGenerate from "../components/simulate/ModeGenerate";
import SimulateHistory from "../components/simulate/SimulateHistory";
import Pagination from "../components/Pagination";

const MODES = [
  { key: "simulate", label: "Prompt Simulator" },
  { key: "intelligence", label: "Prompt Intelligence" },
  { key: "score", label: "Score Prompt" },
  { key: "generate", label: "Generate Prompts" },
];

export default function Simulate() {
  const { token } = useAuth();
  const [mode, setMode] = useState("simulate");
  const [historyPage, setHistoryPage] = useState(1);

  // const { data: historyRes, refetch: refetchHistory } = useApi(
  //   token ? () => promptApi.history({ limit: 8 }) : null,
  //   [token],
  // );
  // const {
  //   data: historyRes,
  //   loading,
  //   error,
  //   refetch: refetchHistory,
  // } = useApi(token ? () => promptApi.history({ limit: 8 }) : null, [token]);
  // const history = historyRes?.data ?? [];

  const {
    data: historyRes,
    loading,
    error,
    refetch: refetchHistory,
  } = useApi(
    token ? () => promptApi.history({ limit: 20, page: historyPage }) : null,
    [token, historyPage],
  );

  const history = historyRes?.data ?? [];
  const pagination = historyRes?.pagination;
  if (loading) {
    return (
      <div className="flex min-h-[70vh] q-center justify-center">
        <AiSpinner size={70} label="Loading simulator..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-error text-lg font-semibold">
        {error}
      </div>
    );
  }
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
                ? "bg-primary cursor-pointer text-on-primary shadow-sm"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface cursor-pointer"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mode content — each mode owns its own state */}
      <div
        className="rounded-2xl border border-outline-variant p-6"
        style={{ background: "var(--color-blue-base)" }}
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
      {/* {mode === "simulate" && <SimulateHistory history={history} />} */}
      {mode === "simulate" && (
        <>
          <SimulateHistory history={history} />

          <Pagination
            page={historyPage}
            totalPages={pagination?.totalPages}
            onChange={setHistoryPage}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}
