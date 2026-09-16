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
  {
    key: "simulate",
    label: "Prompt Simulator",
    tooltip: "Test how AI engines recommend your products.",
  },
  {
    key: "intelligence",
    label: "Prompt Intelligence",
    tooltip: "Understand what buyers are asking AI.",
  },
  {
    key: "score",
    label: "Score Prompt",
    tooltip: "See how well a prompt matches your catalog.",
  },
  {
    key: "generate",
    label: "Generate Prompts",
    tooltip: "Generate prompts based on your products.",
  },
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
  if (loading && !historyRes) {
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
        {MODES.map(({ key, label, tooltip }) => (
          <div key={key} className="relative inline-flex">
            <button
              type="button"
              onClick={() => setMode(key)}
              className={`peer rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                mode === key
                  ? "bg-primary cursor-pointer text-on-primary shadow-sm"
                  : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface cursor-pointer"
              }`}
            >
              {label}
            </button>

            <div
              className="
    pointer-events-none
    absolute top-full left-1/2 -translate-x-1/2 mt-2
    z-50
    w-max max-w-[200px]
    rounded-lg
    bg-gray-500
    border border-surface-container-highest
    px-3 py-2
    text-[11px] font-medium
    text-white
    text-center
    shadow-lg
    opacity-0 invisible
    peer-hover:opacity-100 peer-hover:visible
    transition-opacity duration-150
  "
            >
              {tooltip}
            </div>
          </div>
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
