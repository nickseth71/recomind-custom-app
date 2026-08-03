// app/routes/app.promptwins.jsx
// Prompt Win Dashboard — store-wide and per-product visibility
// Route: /app/promptwin

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { promptApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import {useAuth} from "../context/Authcontext"
import AiSpinner from "../components/loader/AiSpinner";
import ProgressCircle from "../components/ProgressCircle";
import PromptRow from "../components/PromptRow";
import Pagination from "../components/Pagination";
import {
  Search,
  X,
  Target,
  AlertTriangle,
  Zap,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Card, Eyebrow, PageHeader, useDebounced } from "../components/UI";
import { jwtDecode } from "jwt-decode";

export const loader = async () => null;

const PAGE_SIZE = 10;

const TABS = [
  { key: "missing", label: "Losing", color: "text-error" },
  { key: "improve", label: "Improve", color: "text-on-tertiary-fixed-variant" },
  { key: "winning", label: "Winning", color: "text-green-win" },
  { key: "all", label: "All Prompts", color: "text-on-surface-variant" },
];

const EMPTY_MSG = {
  missing: "No losing prompts. Your coverage is solid.",
  improve: "No medium-visibility prompts right now.",
  winning: "No winning prompts yet — run an analysis first.",
  all: "No prompts tracked yet.",
};

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
  const { token } = useAuth();
  const decoded = token ? jwtDecode(token) : {};
  const plan = decoded.storePlan;

  const [activeTab, setActiveTab] = useState("missing");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounced(searchTerm, 400);

  // Reset to page 1 whenever the tab or the search term changes — a stale
  // page number from a previous, larger result set would otherwise show
  // an empty page instead of the actual first page of new results.
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  // Lightweight summary — counts + coverage + plan limits. Independent of
  // tab/page/search, so it never refetches just because you're paging
  // through a list.
  const {
    data: summaryRaw,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useApi(token ? () => promptApi.dashboard({}) : null, [token]);

  // The actual paginated, categorized list — refetches on tab/page/search change.
  const {
    data: listRaw,
    loading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useApi(
    token
      ? () =>
          promptApi.dashboardPrompts({
            category: activeTab,
            page,
            limit: PAGE_SIZE,
            search: debouncedSearch,
          })
      : null,
    [token, activeTab, page, debouncedSearch],
  );

  const summary = summaryRaw?.data ?? {};
  const counts = summary.visibilityCounts ?? {};
  const limits = summary.planLimits ?? null;
  const hasAnyPrompts = (summary.summary?.total ?? 0) > 0;

  const list = listRaw?.data ?? {};
  const prompts = list.prompts ?? [];
  const pagination = list.pagination ?? { page: 1, totalPages: 1, total: 0 };

  function refetchAll() {
    refetchSummary();
    refetchList();
  }

  const tabCounts = {
    missing: counts.LOW ?? 0,
    improve: counts.MEDIUM ?? 0,
    winning: counts.HIGH ?? 0,
    all: summary.summary?.total ?? 0,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Prompt Win Dashboard"
        subtitle="See which buyer queries your products win, need improvement, or are missing from entirely."
        actions={
          <button
            onClick={refetchAll}
            disabled={summaryLoading}
            className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-on-surface hover:brightness-95 transition-all disabled:opacity-50 font-label-md text-label-md"
          >
            {summaryLoading ? (
              <Loader2 size={15} className="animate-spin" strokeWidth={1.8} />
            ) : (
              <RefreshCw size={15} strokeWidth={1.8} />
            )}
            Refresh
          </button>
        }
      />

      {summaryLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AiSpinner label="Loading Prompt Win Dashboard" />
        </div>
      )}

      {summaryError && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertTriangle size={48} className="text-error" strokeWidth={1.5} />
          <p className="text-error font-mono-sm text-mono-sm font-semibold">
            {summaryError}
          </p>
          <button
            onClick={refetchAll}
            className="px-5 py-2.5 rounded-xl font-bold border border-error/40 bg-error/10 text-error hover:bg-error/20 transition-all font-mono-sm text-mono-sm"
          >
            Retry
          </button>
        </div>
      )}

      {!summaryLoading && !summaryError && (
        <>
          <PlanBar limits={limits} plan={plan} />

          {/* Summary stat row */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-5 flex items-center gap-4 col-span-1">
              <ProgressCircle
                segments={[
                  { value: counts.HIGH ?? 0, color: "#00e29e" },
                  { value: counts.MEDIUM ?? 0, color: "#e9ba00" },
                  { value: counts.LOW ?? 0, color: "#ba1a1a" },
                ]}
                centerLabel="prompts"
              />
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
                  losing
                </p>
              </div>
            </Card>

            <StatTile
              label="Winning Prompts"
              value={tabCounts.winning}
              sub="AI recommends your product"
              colorClass="text-green-win"
              accentLeft="border-l-2 border-l-[#00e29e]"
            />
            <StatTile
              label="Need Improvement"
              value={tabCounts.improve}
              sub="Partially visible — fixable"
              colorClass="text-on-tertiary-fixed-variant"
              accentLeft="border-l-2 border-l-[#e9ba00]"
            />
            <StatTile
              label="Losing"
              value={tabCounts.missing}
              sub="AI skips your product entirely"
              colorClass="text-error"
              accentLeft="border-l-2 border-l-error"
            />
          </div>

          {/* Empty state — no prompts at all in the store */}
          {!hasAnyPrompts && (
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
          {hasAnyPrompts && (
            <Card className="overflow-hidden">
              {/* Tab bar */}
              <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-outline-variant/40 flex-wrap gap-3">
                <div className="flex gap-0">
                  {TABS.map(({ key, label, color }) => {
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
                          {tabCounts[key]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search bar — filters within the active tab */}
                <div className="pb-3">
                  <div className="relative w-72">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      type="text"
                      placeholder="Search prompts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low pl-10 pr-9 py-2 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-colors"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                        aria-label="Clear search"
                      >
                        <X size={14} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tab content */}
              <div className="p-5">
                {listLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2
                      size={22}
                      className="animate-spin text-primary"
                      strokeWidth={1.8}
                    />
                  </div>
                ) : listError ? (
                  <p className="text-error font-mono-sm text-mono-sm text-center py-6">
                    {listError}
                  </p>
                ) : prompts.length === 0 ? (
                  <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low/50 px-5 py-8 text-center">
                    <p className="font-mono-sm text-mono-sm text-on-surface-variant">
                      {debouncedSearch
                        ? `No prompts match "${debouncedSearch}" in this tab.`
                        : EMPTY_MSG[activeTab]}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 mb-4">
                      {prompts.map((item) => (
                        <PromptRow key={item._id} item={item} />
                      ))}
                    </div>
                    <Pagination
                      page={pagination.page}
                      totalPages={pagination.totalPages}
                      onChange={setPage}
                    />
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Quick link to product-specific view hint */}
          {hasAnyPrompts && (
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
                  Prompts tab to see win/improve/losing filtered to that product
                  only.
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
