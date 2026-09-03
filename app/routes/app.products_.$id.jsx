// app/routes/app.products_.$id.jsx
// NOTE: filename uses "products_" (trailing underscore) so this is a
// SIBLING route at /app/products/:id, not nested under app.products.jsx.
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { productApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/Authcontext";
import {
  Card,
  Eyebrow,
  BackLink,
  PillTabs,
  SBox,
  Chip,
  ScoreRing,
  ScoreBar,
  confColors,
  impactColors,
  effortColors,
  scoreTextClass,
  scoreLabel,
  BREAKDOWN_META,
  ENGINE_COLORS,
  ENGINE_LABELS,
} from "../components/UI";
import {
  CheckCircle2,
  TriangleAlert,
  Loader2,
  Package,
  Brain,
  BarChart2,
  Wrench,
  HelpCircle,
  GitCompare,
  Search,
} from "lucide-react";

// function stripHtml(value = "") {
//   return String(value)
//     .replace(/<[^>]+>/g, " ")
//     .replace(/&nbsp;/gi, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ═══ OVERVIEW PANEL ═══════════════════════════════════════════ */
function OverviewPanel({ analysis, product }) {
  const images = product?.images || [];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[42%_58%] gap-x-2 ">
        <Card className="p-5 flex items-center  justify-center ">
          <div className="relative w-[95%] h-[300px]  overflow-hidden rounded-xl">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={product?.title}
                className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-700 ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          {/* <ScoreRing score={analysis.score} size={110}  />
          <div>
            <Eyebrow>AI Readiness Score</Eyebrow>
            <div
              className={`text-[36px] font-black leading-none mt-1 ${scoreTextClass(analysis.score)}`}
            >
              {analysis.score}
              <span className="text-[16px] font-semibold text-on-surface-variant ml-1">
                /100
              </span>
            </div>
            <span
              className={`inline-block font-mono-sm text-[11px] font-bold mt-2 px-2.5 py-1 rounded-full border ${
                analysis.score >= 70
                  ? "text-green-win bg-[#00e29e]/12 border-[#00e29e]/35"
                  : analysis.score >= 40
                    ? "text-on-tertiary-fixed-variant bg-tertiary-fixed/25 border-tertiary-fixed/50"
                    : "text-error bg-error/10 border-error/30"
              }`}
            >
              {scoreLabel(analysis.score)}
            </span>
            {analysis.reasoning && (
              <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-3 max-w-[200px]">
                {analysis.reasoning}
              </p>
            )}
          </div> */}
        </Card>
        <Card className="p-5">
          <Eyebrow className="mb-4">Score Breakdown</Eyebrow>
          <div className="flex flex-col gap-3">
            {analysis.scoreBreakdown &&
              Object.entries(analysis.scoreBreakdown).map(([k, v]) => {
                const meta = BREAKDOWN_META[k];
                if (!meta) return null;
                return (
                  <div key={k} className="flex items-center gap-3">
                    <span className="font-mono-sm text-[10px] text-on-surface-variant w-28 shrink-0">
                      {meta.label}
                    </span>
                    <ScoreBar value={v} max={meta.max} />
                    <span className="font-mono-sm text-mono-sm text-on-surface-variant w-10 text-right">
                      {v}/{meta.max}
                    </span>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>

      {analysis.engineCoverage && (
        <SBox label="AI Engine Coverage">
          <div
            className={`grid gap-3 ${
              analysis.engineCoverage.claude != null
                ? "grid-cols-5"
                : "grid-cols-4"
            }`}
          >
            {[
              { key: "chatgpt" },
              { key: "perplexity" },
              { key: "gemini" },
              { key: "aiOverview" },
              // Claude is Growth+ only — the backend omits the key entirely
              // for plans that don't include it, so this naturally stays
              // hidden for Starter without duplicating plan-gating logic
              // here.
              ...(analysis.engineCoverage.claude != null
                ? [{ key: "claude" }]
                : []),
            ].map(({ key }) => (
              <div
                key={key}
                className="rounded-xl border border-outline-variant bg-surface-container-highest p-4 text-center"
              >
                <div
                  className="text-[26px] font-black"
                  style={{ color: ENGINE_COLORS[key] }}
                >
                  {analysis.engineCoverage[key] ?? 0}%
                </div>
                <p className="font-mono-sm text-[11px] text-on-surface-variant mt-1">
                  {ENGINE_LABELS[key]}
                </p>
              </div>
            ))}
          </div>
        </SBox>
      )}

      <div className="grid grid-cols-2 gap-4">
        {analysis.bestFor?.length > 0 && (
          <SBox label="Best For" labelClass="text-green-win">
            <div>
              {analysis.bestFor.map((b) => (
                <Chip
                  key={b}
                  text={b}
                  colorClass="text-green-win"
                  bgClass="bg-[#00e29e]/12"
                  borderClass="border-[#00e29e]/30"
                />
              ))}
            </div>
          </SBox>
        )}
        {analysis.intentKeywords?.length > 0 && (
          <SBox
            label="Intent Keywords"
            labelClass="text-on-secondary-container"
          >
            <div>
              {analysis.intentKeywords.map((k) => (
                <Chip key={k} text={k} />
              ))}
            </div>
          </SBox>
        )}
      </div>

      {analysis.missingSignals?.length > 0 && (
        <div className="rounded-xl border border-error/20 bg-error/5 p-5">
          <p className="font-mono-sm text-[10px] font-bold uppercase text-error mb-3">
            ⚠ Missing Signals
          </p>
          <div className="grid grid-cols-2 gap-2">
            {analysis.missingSignals.map((m) => (
              <div
                key={m}
                className="flex gap-2 py-2 font-mono-sm text-mono-sm text-error border-b border-outline-variant/40 last:border-0"
              >
                <span className="shrink-0">⚠</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ INTELLIGENCE PANEL ════════════════════════════════════════ */
function IntelligencePanel({ interpretation, plan }) {
  if (!interpretation?.productIdentity)
    return (
      <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center py-16">
        No interpretation data available.
      </p>
    );
  const id = interpretation.productIdentity || {},
    aud = interpretation.audienceProfile || {},
    sem = interpretation.semanticAttributes || {},
    comp = interpretation.competitiveContext || {},
    gaps = interpretation.aiReadinessGaps || {};
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <SBox label="Product Identity" labelClass="text-green-win">
          <div className="flex flex-col gap-3">
            {[
              ["Category", id.productCategory],
              ["Sub-category", id.subCategory],
              ["Form Factor", id.productFormFactor],
              ["Brand Position", id.brandPositioning],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-[0.12em] mb-0.5">
                    {k}
                  </p>
                  <p className="text-[13px] font-semibold text-on-surface">
                    {v}
                  </p>
                </div>
              ))}
            {id.confidence && (
              <div>
                <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-[0.12em] mb-1">
                  Confidence
                </p>
                <span
                  className={`font-mono-sm text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg border ${confColors(id.confidence).text} ${confColors(id.confidence).bg} ${confColors(id.confidence).border}`}
                >
                  {id.confidence}
                </span>
              </div>
            )}
            {id.keyIngredients?.length > 0 && (
              <div>
                <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-[0.12em] mb-1.5">
                  Key Ingredients
                </p>
                <div className="flex flex-wrap -m-1">
                  {id.keyIngredients.map((i) => (
                    <Chip key={i} text={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </SBox>
        <SBox label="Buyer Profile" labelClass="text-on-secondary-container">
          <div className="flex flex-col gap-3">
            {[
              ["Primary Buyer", aud.primaryBuyer],
              ["Motivation", aud.buyerMotivation],
              ["Purchase Trigger", aud.purchaseTrigger],
              ["Experience", aud.experienceLevel],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-[0.12em] mb-0.5">
                    {k}
                  </p>
                  <p className="text-[12px] text-on-surface">{v}</p>
                </div>
              ))}
            {aud.buyerObjections?.length > 0 && (
              <div>
                <p className="font-mono-sm text-[10px] text-error uppercase tracking-[0.12em] mb-1.5">
                  Buyer Objections
                </p>
                {aud.buyerObjections.map((o) => (
                  <div
                    key={o}
                    className="flex gap-2 py-1.5 font-mono-sm text-mono-sm text-error border-b border-outline-variant/30 last:border-0"
                  >
                    <span className="shrink-0">⚠</span>
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SBox>
      </div>

      {sem.inferredAttributes?.length > 0 && (
        <SBox
          label="Inferred Semantic Attributes"
          labelClass="text-on-tertiary-fixed-variant"
        >
          <div className="flex flex-col gap-1">
            {sem.inferredAttributes.map((a, i) => {
              const cc = confColors(a.confidence);
              return (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 py-2.5 border-b border-outline-variant/30 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-on-surface">
                      {a.attribute}
                    </p>
                    <p className="font-mono-sm text-[10px] text-on-surface-variant mt-0.5">
                      from: {a.inferredFrom}
                    </p>
                    {a.aiImportance && (
                      <p className="font-mono-sm text-[10px] text-on-surface-variant italic mt-0.5">
                        {a.aiImportance}
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-mono-sm text-[9px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${cc.text} ${cc.bg} ${cc.border}`}
                  >
                    {a.confidence}
                  </span>
                </div>
              );
            })}
          </div>
          {sem.missingCriticalAttributes?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-outline-variant/30">
              <p className="font-mono-sm text-[10px] text-error uppercase tracking-[0.12em] mb-2">
                Missing Critical Attributes
              </p>
              <div className="flex flex-wrap">
                {sem.missingCriticalAttributes.map((a) => (
                  <Chip
                    key={a}
                    text={a}
                    colorClass="text-error"
                    bgClass="bg-error/10"
                    borderClass="border-error/25"
                  />
                ))}
              </div>
            </div>
          )}
        </SBox>
      )}

      {plan !== "starter" &&
        (comp.directCompetitors?.length > 0 ||
          comp.differentiators?.length > 0) && (
          <div className="grid grid-cols-2 gap-4">
            {comp.directCompetitors?.length > 0 && (
              <SBox
                label="Direct Competitors"
                labelClass="text-on-secondary-container"
              >
                <div className="flex flex-wrap">
                  {comp.directCompetitors.map((c) => (
                    <Chip key={c} text={c} />
                  ))}
                </div>
              </SBox>
            )}
            {comp.differentiators?.length > 0 && (
              <SBox label="Differentiators" labelClass="text-green-win">
                {comp.differentiators.map((d) => (
                  <div
                    key={d}
                    className="flex gap-2 py-1.5 font-mono-sm text-mono-sm text-on-surface border-b border-outline-variant/30 last:border-0"
                  >
                    <span className="text-green-win shrink-0">✓</span>
                    {d}
                  </div>
                ))}
              </SBox>
            )}
          </div>
        )}

      {gaps.criticalGaps?.length > 0 && (
        <div className="rounded-xl border border-error/20 bg-error/5 p-5">
          <p className="font-mono-sm text-[10px] font-bold uppercase text-error mb-4">
            ⚠ AI Readiness Gaps
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Critical",
                items: gaps.criticalGaps,
                cls: "text-error",
              },
              {
                label: "Moderate",
                items: gaps.moderateGaps,
                cls: "text-on-tertiary-fixed-variant",
              },
              {
                label: "Minor",
                items: gaps.minorGaps,
                cls: "text-on-surface-variant",
              },
            ]
              .filter((g) => g.items?.length)
              .map((g) => (
                <div key={g.label}>
                  <p
                    className={`font-mono-sm text-[10px] font-bold uppercase tracking-[0.12em] mb-2 ${g.cls}`}
                  >
                    {g.label}
                  </p>
                  {g.items.map((item) => (
                    <div
                      key={item}
                      className={`flex gap-2 py-1 font-mono-sm text-[11px] border-b border-outline-variant/20 last:border-0 ${g.cls}`}
                    >
                      <span className="shrink-0">→</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ SMART PROMPTS PANEL ══════════════════════════════════════ */
function SmartPromptsPanel({ smartPrompts }) {
  const [activeCluster, setActiveCluster] = useState(null);
  if (!smartPrompts?.prompts?.length)
    return (
      <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center py-16">
        No smart prompts available.
      </p>
    );
  const prompts = smartPrompts.prompts || [],
    clusters = smartPrompts.promptClusters || [];
  const highVal = new Set(smartPrompts.highValuePrompts || []),
    hardWin = new Set(smartPrompts.hardToWinPrompts || []);
  const counts = {
    HIGH: prompts.filter((p) => p.winProbability === "HIGH").length,
    MEDIUM: prompts.filter((p) => p.winProbability === "MEDIUM").length,
    LOW: prompts.filter((p) => p.winProbability === "LOW").length,
  };
  const display = activeCluster
    ? prompts.filter((p) =>
        clusters
          .find((c) => c.clusterName === activeCluster)
          ?.prompts?.includes(p.prompt),
      )
    : prompts;
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Winnable Now",
            count: counts.HIGH,
            cls: confColors("HIGH"),
          },
          {
            label: "With Work",
            count: counts.MEDIUM,
            cls: confColors("MEDIUM"),
          },
          { label: "Hard to Win", count: counts.LOW, cls: confColors("LOW") },
        ].map(({ label, count, cls }) => (
          <div
            key={label}
            className={`rounded-xl border p-4 text-center ${cls.text} ${cls.bg} ${cls.border}`}
          >
            <div className="text-[28px] font-black leading-none">{count}</div>
            <p className="font-mono-sm text-[11px] font-semibold mt-1 opacity-80">
              {label}
            </p>
          </div>
        ))}
      </div>
      {clusters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {[{ clusterName: null }, ...clusters].map((c) => {
            const active = activeCluster === c.clusterName;
            return (
              <button
                key={c.clusterName ?? "all"}
                onClick={() => setActiveCluster(c.clusterName)}
                className={`font-mono-sm text-[11px] font-bold px-3.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${active ? "bg-secondary-container/50 text-on-secondary-container border-secondary/30" : "bg-transparent text-on-surface-variant border-outline-variant hover:text-on-surface"}`}
              >
                {c.clusterName ?? "All Prompts"}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {display.map((p, i) => {
          const wc = confColors(p.winProbability),
            isHV = highVal.has(p.prompt),
            isHW = hardWin.has(p.prompt);
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 flex items-start gap-3 bg-surface-container-low ${isHV ? "border-[#00e29e]/35" : "border-outline-variant"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[13px] font-semibold text-on-surface">
                    "{p.prompt}"
                  </span>
                  {/* <Link
                    to={`/app/promptwins/${p._id || p.id}`}
                    className="bg-[#44464f]/20 h-6 w-14 rounded-xl text-mono-sm  font-mono-sm ml-2"
                  >
                    Detail
                  </Link> */}
                  {/* <Link
  to={`/app/promptwins/${p._id || p.id}`}
  className="inline-flex items-center justify-center h-6 px-4 rounded-xl border border-[#B8B8B8] bg-[#F3F3F3] text-[#555555] font-mono-sm text-[11px] font-bold hover:bg-[#E6E6E6] hover:text-[#2F2F2F] transition-all">
  Detail
</Link> */}
                  {/* {isHV && (
                    <span className="font-mono-sm text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border text-green-win bg-[#00e29e]/12 border-[#00e29e]/35">
                      <Star size={8} className="inline mr-0.5" />
                      High Value
                    </span>
                  )} */}
                  {/* {isHW && (
                    <span className="font-mono-sm text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border text-error bg-error/10 border-error/30">
                      Hard
                    </span>
                  )}*/}
                </div>
                {p.intent && (
                  <p className="font-mono-sm text-mono-sm text-on-surface-variant">
                    {p.intent}
                  </p>
                )}
                {p.targetedAttribute && (
                  <p className="font-mono-sm text-[10px] text-on-secondary-container mt-0.5">
                    tests: {p.targetedAttribute}
                  </p>
                )}
                {p.promptType && (
                  <p className="font-mono-sm text-[10px] text-on-surface-variant/60 mt-0.5">
                    {p.promptType}
                    {p.stage ? ` · ${p.stage}` : ""}
                  </p>
                )}
              </div>
              <span
                className={`font-mono-sm text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border shrink-0 ${wc.text} ${wc.bg} ${wc.border}`}
              >
                {p.winProbability}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ FIXES PANEL ══════════════════════════════════════════════ */
function FixesPanel({ fixes }) {
  if (!fixes?.length)
    return (
      <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center py-16">
        No fixes generated yet.
      </p>
    );
  return (
    <div className="flex flex-col gap-3">
      {fixes.map((f, i) => {
        const ic = impactColors(f.impact),
          ec = effortColors(f.effort);
        return (
          <div
            key={i}
            className={`rounded-xl border p-4 flex gap-4 bg-surface-container-low ${f.impact === "HIGH" ? "border-error/30" : "border-outline-variant"}`}
          >
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-mono-sm text-[12px] font-black border mt-0.5 ${ic.text} ${ic.bg} ${ic.border}`}
            >
              {f.priority || i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-on-surface mb-1.5">
                {f.fix}
              </p>
              {f.reason && (
                <p className="font-mono-sm text-mono-sm text-on-surface-variant mb-3">
                  {f.reason}
                </p>
              )}
              <div className="flex gap-2">
                <span
                  className={`font-mono-sm text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${ic.text} ${ic.bg} ${ic.border}`}
                >
                  {f.impact} impact
                </span>
                <span
                  className={`font-mono-sm text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${ec.text} ${ec.bg} ${ec.border}`}
                >
                  {f.effort} effort
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ FAQ PANEL ════════════════════════════════════════════════ */
function FaqPanel({ analysis }) {
  return (
    <div className="flex flex-col gap-4">
      {analysis.faqAnalysis && (
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 flex items-center gap-6 flex-wrap">
          {[
            [
              "Existing",
              analysis.faqAnalysis.existingCount ?? 0,
              "text-on-surface-variant",
            ],
            [
              "Suggested",
              analysis.faqAnalysis.suggestedCount ?? 0,
              "text-green-win",
            ],
            [
              "Needs Fix",
              analysis.faqAnalysis.needsImprovement ? "Yes" : "No",
              analysis.faqAnalysis.needsImprovement
                ? "text-error"
                : "text-on-surface-variant",
            ],
            [
              "Action",
              (analysis.faqAnalysis.action || "—").toUpperCase(),
              "text-on-secondary-container",
            ],
          ].map(([label, val, cls]) => (
            <div key={label} className="text-center min-w-[60px]">
              <div className={`text-[22px] font-black ${cls}`}>{val}</div>
              <p className="font-mono-sm text-[10px] text-on-surface-variant">
                {label}
              </p>
            </div>
          ))}
          {analysis.faqAnalysis.objectionsUncovered?.length > 0 && (
            <div className="ml-auto">
              <p className="font-mono-sm text-[10px] font-bold uppercase text-error mb-1.5">
                Uncovered objections
              </p>
              {analysis.faqAnalysis.objectionsUncovered.slice(0, 3).map((o) => (
                <div
                  key={o}
                  className="font-mono-sm text-[10px] text-error flex gap-1.5"
                >
                  <span>⚠</span>
                  {o}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!analysis.faq?.length ? (
        <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center py-10">
          No FAQ generated yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {analysis.faq.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
            >
              <p className="text-[13px] font-bold text-on-surface mb-2">
                {f.question}
              </p>
              <p className="font-mono-sm text-mono-sm text-on-surface-variant leading-relaxed">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ COMPARISON PANEL ═════════════════════════════════════════ */
function ComparisonPanel({ analysis }) {
  return (
    <div className="flex flex-col gap-4">
      {analysis.comparisonOpportunities?.length > 0 && (
        <SBox label="Compared Against">
          <div className="grid grid-cols-2 gap-1">
            {analysis.comparisonOpportunities.map((c) => (
              <div
                key={c}
                className="flex gap-2 py-2 font-mono-sm text-mono-sm text-on-surface border-b border-outline-variant/30 last:border-0"
              >
                <span className="text-on-secondary-container shrink-0">⟷</span>
                {c}
              </div>
            ))}
          </div>
        </SBox>
      )}
      {analysis.trustSignals?.length > 0 && (
        <SBox label="Trust Signals" labelClass="text-green-win">
          <div className="flex flex-wrap">
            {analysis.trustSignals.map((t) => (
              <Chip
                key={t}
                text={t}
                colorClass="text-green-win"
                bgClass="bg-[#00e29e]/12"
                borderClass="border-[#00e29e]/30"
              />
            ))}
          </div>
        </SBox>
      )}
      {!analysis.comparisonOpportunities?.length &&
        !analysis.trustSignals?.length && (
          <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center py-16">
            No comparison data available.
          </p>
        )}
    </div>
  );
}

export const loader = async () => null;

/* ═══ PRODUCT DETAIL PAGE ══════════════════════════════════════ */
export default function ProductDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  console.log(token);
  const decoded = token ? jwtDecode(token) : null;
  const storePlan = decoded?.storePlan?.toLowerCase(); //added
  // const decoded = jwtDecode(token)
  console.log("Decoded Token", decoded);
  const [tab, setTab] = useState("overview");

  const { data, loading, error, refetch } = useApi(
    token && id ? () => productApi.get(id) : null,
    [token, id],
  );

  const detail = data?.data ?? data;
  const product = detail?.product;
  const analysis = detail?.analysis;
  const interpretation = analysis?.interpretation || detail?.interpretation;
  const smartPrompts = analysis?.smartPrompts || detail?.smartPrompts;
  const fixes = analysis?.prioritizedFixes || detail?.prioritizedFixes || [];
  const highFixCount = fixes.filter((f) => f.impact === "HIGH").length;

  const tabItems = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    {
      key: "intelligence",
      label: "Intelligence",
      icon: Brain,
      badge: interpretation ? "AI" : null,
    },
    {
      key: "prompts",
      label: "Smart Prompts",
      icon: Search,
      badge: smartPrompts?.prompts?.length || null,
    },
    { key: "fixes", label: "Fixes", icon: Wrench, badge: highFixCount || null },
    { key: "faq", label: "FAQ", icon: HelpCircle },
    // { key: "comparison", label: "Comparison", icon: GitCompare },
    ...(storePlan !== "starter"
      ? [{ key: "comparison", label: "Comparison", icon: GitCompare }] //checks plan and shows comparison
      : []),
  ];

  return (
    <div className="space-y-5">
      {/* Back + header — lives on the dark page body, so BackLink/title use light-on-dark */}
      <div className="flex items-start gap-4">
        <BackLink to="/app/products" />
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="h-8 w-64 rounded-lg bg-surface-container-highest/30 animate-pulse" />
          ) : (
            <>
              <h1 className="font-headline-lg text-headline-lg text-on-surface truncate">
                {product?.title ?? "Product"}
              </h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {product?.productType && (
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest font-mono-sm text-mono-sm text-on-surface-variant">
                    {product.productType}
                  </span>
                )}
                {product?.vendor && (
                  <span className="px-2.5 py-1 rounded-lg glass-card font-mono-sm text-mono-sm text-on-surface-variant">
                    {product.vendor}
                  </span>
                )}
                {product?.isOptimized && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono-sm text-[10px] font-bold border bg-[#00e29e]/12 border-[#00e29e]/35 text-green-win">
                    <CheckCircle2 size={11} strokeWidth={2} />
                    Optimised
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        <Link
          to="/app/ai-index"
          className="shrink-0 rounded-xl border border-primary/40 px-4 py-2.5 font-mono-sm text-[13px] font-bold text-primary hover:bg-primary/10"
        >
          Publish AI Store Index
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2
            size={40}
            className="animate-spin text-primary"
            strokeWidth={1.5}
          />
          <p className="font-mono-sm text-mono-sm text-secondary-fixed-dim">
            Loading product analysis…
          </p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <TriangleAlert size={48} className="text-error" strokeWidth={1.5} />
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
      {!loading && !error && !analysis && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Package
            size={56}
            className="text-secondary-fixed-dim"
            strokeWidth={1.5}
          />
          <p className="font-mono-sm text-mono-sm text-secondary-fixed-dim text-center">
            No analysis available.
          </p>
          <BackLink to="/app/products">Go Back</BackLink>
        </div>
      )}

      {!loading && !error && analysis && (
        <div className="flex flex-col gap-5">
          {/* Score summary bar */}
          <Card className="p-5 flex items-center gap-5 flex-wrap">
            <ScoreRing score={analysis.score} size={80} />
            <div className="flex-1 min-w-0">
              <Eyebrow>AI Readiness Score</Eyebrow>
              <div
                className={`text-[28px] font-black leading-none mt-1 ${scoreTextClass(analysis.score)}`}
              >
                {analysis.score}
                <span className="text-[14px] font-semibold text-on-surface-variant ml-1">
                  /100 · {scoreLabel(analysis.score)}
                </span>
              </div>
              {analysis.reasoning && (
                <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-1.5 max-w-lg">
                  {analysis.reasoning}
                </p>
              )}
            </div>
            <div className="flex gap-3 shrink-0">
              {[
                {
                  label: "Smart Prompts",
                  value: smartPrompts?.prompts?.length ?? 0,
                  cls: "text-on-surface",
                },
                {
                  label: "Winnable",
                  value:
                    smartPrompts?.prompts?.filter(
                      (p) => p.winProbability === "HIGH",
                    ).length ?? 0,
                  cls: "text-green-win",
                },
                { label: "High Fixes", value: highFixCount, cls: "text-error" },
              ].map(({ label, value, cls }) => (
                <div
                  key={label}
                  className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-center min-w-[72px]"
                >
                  <div className={`text-[20px] font-black ${cls}`}>{value}</div>
                  <p className="font-mono-sm text-[10px] text-on-surface-variant mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Tab bar — glass-card pills, readable on dark body */}
          <div
            className={`mx-auto transition-all duration-300 ${
              storePlan === "starter" ? "w-fit" : "w-full"
            }`}
          >
            <PillTabs
              items={tabItems}
              value={tab}
              onChange={setTab}
              className={
                storePlan !== "starter" ? "w-full  justify-center" : "w-fit"
              }
            />
          </div>
          {/* Tab content */}
          <div>
            {/* {tab === "overview" && <OverviewPanel analysis={analysis} />}
             */}
            {tab === "overview" && (
              <OverviewPanel analysis={analysis} product={product} />
            )}
            {tab === "intelligence" && (
              <IntelligencePanel
                interpretation={interpretation}
                plan={storePlan}
              />
            )}
            {tab === "prompts" && (
              <SmartPromptsPanel smartPrompts={smartPrompts} />
            )}
            {tab === "fixes" && <FixesPanel fixes={fixes} />}
            {tab === "faq" && <FaqPanel analysis={analysis} />}
            {tab === "comparison" && storePlan !== "starter" && (
              <ComparisonPanel analysis={analysis} />
            )}
            {/* {tab === "comparison" && <ComparisonPanel analysis={analysis} />} */}
          </div>
        </div>
      )}
    </div>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
