// src/pages/Reports.jsx
import { useState } from "react";
import {
  FileText,
  FileCode2,
  BarChart3,
  Sparkles,
  Lock,
  Download,
  Package,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { reportApi, storeApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import {
  PageHeader,
  Card,
  CardHeader,
  Divider,
  Toast,
  Btn,
  Badge,
  Spinner,
  StatCard,
} from "../components/UI";

const ACTION_LABELS = {
  STORE_INSTALLED: "App Installed",
  STORE_UNINSTALLED: "App Uninstalled",
  PRODUCT_ANALYSED: "Product Analysed",
  PRODUCT_OPTIMISED: "Product Optimised",
  PRODUCT_OPTIMISATION_ROLLED_BACK: "Rollback Applied",
  PRODUCTS_SYNCED: "Products Synced",
  BULK_OPTIMISE_STARTED: "Bulk Optimise Started",
  PLAN_CHANGED: "Plan Changed",
  PROMPT_SIMULATED: "Prompt Simulated",
  REPORT_EXPORTED: "Report Exported",
};

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [toast, setToast] = useState(null);
  const [loadingKey, setLoadingKey] = useState(null);

  // Store plan now comes from the actual auth'd store, not a missing prop
  const { data: storeRes } = useApi(() => storeApi.getMe(), []);
  const storePlan = storeRes?.store?.plan ?? storeRes?.plan;

  const { data: summaryRes } = useApi(() => reportApi.summary(), []);
  const { data: auditRes, loading: auditLoading } = useApi(
    () => reportApi.auditLog({ limit: 15 }),
    [],
  );

  const s = summaryRes?.summary;
  const auditLogs = auditRes?.data ?? (Array.isArray(auditRes) ? auditRes : []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function downloadLlmsTxt() {
    setLoadingKey("llms");
    try {
      const text = await reportApi.llmsTxt();
      triggerDownload(new Blob([text], { type: "text/plain" }), "llms.txt");
      showToast("llms.txt downloaded");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoadingKey(null);
    }
  }

  async function downloadSummary() {
    setLoadingKey("summary");
    try {
      const res = await reportApi.summary();
      triggerDownload(
        new Blob([JSON.stringify(res.data ?? res, null, 2)], {
          type: "application/json",
        }),
        "shopmind-report.json",
      );
      showToast("Report exported");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoadingKey(null);
    }
  }

  const isGrowthPlus = ["growth", "agency"].includes(storePlan);
  const isAgency = storePlan === "agency";

  const reportCards = [
    {
      key: "summary",
      icon: FileText,
      iconColor: "#187bda",
      title: "AI Visibility Audit",
      badge: "JSON",
      desc: "Full store AI readiness report with scores, gaps, and recommendations for every product.",
      locked: false,
      action: downloadSummary,
    },
    {
      key: "llms",
      icon: FileCode2,
      iconColor: "#00875a",
      title: "llms.txt Generator",
      badge: "TXT",
      desc: "Auto-build an AI-readable site context file for LLM crawlers like Perplexity and ChatGPT.",
      locked: false,
      action: downloadLlmsTxt,
    },
    {
      key: "competitor",
      icon: BarChart3,
      iconColor: "#e9ba00",
      title: "Competitor Gap Report",
      badge: "XLSX",
      desc: "Compare your products against competitors in AI recommendation scenarios.",
      locked: !isGrowthPlus,
      lockLabel: "Growth+",
    },
    {
      key: "whitelabel",
      icon: Sparkles,
      iconColor: "#7b5800",
      title: "White-label Agency Report",
      badge: "PDF",
      desc: "Branded PDF for client delivery with your logo and commentary. Agency plan only.",
      locked: !isAgency,
      lockLabel: "Agency",
    },
  ];

  const stats = s
    ? [
        {
          icon: Package,
          label: "Total Products",
          value: s.totalProducts ?? 0,
          color: "#187bda",
        },
        {
          icon: Gauge,
          label: "Avg AI Score",
          value: s.avgAiScore ?? 0,
          unit: "/100",
          color: "#00875a",
        },
        {
          icon: CheckCircle2,
          label: "Optimised",
          value: s.optimisedProducts ?? 0,
          color: "#7b5800",
        },
        {
          icon: AlertTriangle,
          label: "Critical",
          value: s.criticalProducts ?? 0,
          color: "#ba1a1a",
        },
      ]
    : [];

  return (
    <div className="animate-in">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <PageHeader
        title="Reports & Exports"
        subtitle="AI visibility audits, white-label reports, and llms.txt exports"
      />

      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 mb-7">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
        {reportCards.map((r) => {
          const Ico = r.icon;
          return (
            <Card key={r.key} className={r.locked ? "opacity-60" : ""}>
              <div className="p-6">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${r.iconColor}1a` }}
                >
                  <Ico size={20} color={r.iconColor} strokeWidth={2} />
                </div>

                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-bold text-[15px] text-on-surface">
                    {r.title}
                  </span>
                  <Badge text={r.badge} color="#187bda" />
                  {r.locked && <Badge text={r.lockLabel} color="#7b5800" />}
                </div>

                <p className="text-on-surface-variant text-[12px] leading-relaxed mb-5">
                  {r.desc}
                </p>

                <Btn
                  onClick={r.locked ? undefined : r.action}
                  disabled={r.locked || loadingKey === r.key}
                  variant={r.locked ? "ghost" : "primary"}
                >
                  {loadingKey === r.key ? (
                    <>
                      <Spinner size={14} /> Generating...
                    </>
                  ) : r.locked ? (
                    <>
                      <Lock size={13} strokeWidth={2} /> Upgrade to{" "}
                      {r.lockLabel}
                    </>
                  ) : (
                    <>
                      Generate <Download size={14} strokeWidth={2} />
                    </>
                  )}
                </Btn>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader eyebrow="History" title="Activity Log" />
        <Divider />
        <div className="px-6 py-2 pb-4">
          {auditLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size={20} color="#111844" />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-[13px]">
              No activity recorded yet.
            </div>
          ) : (
            auditLogs.map((log) => {
              const meta = log.metadata || {};
              const detail =
                meta.score != null
                  ? `Score: ${meta.score}`
                  : meta.synced != null
                    ? `${meta.synced} products`
                    : meta.shopName || "";
              return (
                <div
                  key={log._id}
                  className="flex items-center gap-3.5 py-2.5 border-b border-outline-variant last:border-0"
                >
                  <span className="bg-surface-container-low border border-outline-variant rounded-md px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant whitespace-nowrap">
                    {ACTION_LABELS[log.action] || log.action}
                  </span>
                  <span className="flex-1 text-[12px] text-on-surface-variant/70 truncate">
                    {detail}
                  </span>
                  <span className="text-[11px] text-on-surface-variant/60 shrink-0 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
