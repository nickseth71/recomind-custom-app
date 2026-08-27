// // app/routes/app.products.jsx
// import { useState, useRef, useEffect } from "react";
// import { Link } from "react-router";
// import { boundary } from "@shopify/shopify-app-react-router/server";
// import { productApi, promptApi } from "../lib/api";
// import { useApi } from "../hooks/useApi";
// import AiSpinner from "../components/loader/AiSpinner";
// import {
//   Card,
//   Divider,
//   Eyebrow,
//   PageHeader,
//   PillTabs,
//   Modal,
//   Toast,
//   StatusBadge,
//   ProductThumb,
//   MiniScoreRing,
//   useDebounced,
//   scoreColor,
//   scoreTextClass,
//   scoreBarClass,
//   scoreLabel,
//   winProbColors,
// } from "../components/UI";
// import {
//   Package,
//   CheckCircle2,
//   TriangleAlert,
//   Clock4,
//   Zap,
//   RotateCcw,
//   Search,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   Download,
//   Loader2,
//   Diamond,
//   Brain,
//   Play,
//   Eye,
//   WandSparkles,
//   BarChart2,
// } from "lucide-react";

// function stripHtml(value = "") {
//   return String(value)
//     .replace(/<[^>]+>/g, " ")
//     .replace(/&nbsp;/gi, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// /* ─── Action button — three states based on product progress ──────────── */
// function ActionButton({ product, onConfirmAnalyse, onOptimise }) {
//   if (product.analysisScore == null)
//     return (
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           onConfirmAnalyse();
//         }}
//         className="px-3 py-1.5 rounded-lg font-mono-sm text-[11px] font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity"
//       >
//         Analyse
//       </button>
//     );
//   if (!product.isOptimized)
//     return (
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           onOptimise();
//         }}
//         className="px-3 py-1.5 rounded-lg font-mono-sm text-[11px] font-semibold bg-secondary-container text-on-secondary-container border border-secondary-fixed/30 hover:opacity-90 transition-opacity"
//       >
//         Optimise
//       </button>
//     );
//   return (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         onConfirmAnalyse();
//       }}
//       className="px-3 py-1.5 rounded-lg font-mono-sm text-[11px] font-semibold border border-outline-variant text-on-surface-variant bg-surface-container hover:text-on-surface transition-colors"
//     >
//       Re-analyse
//     </button>
//   );
// }

// /* ═══ CONFIRM ANALYSE MODAL ════════════════════════════════════ */
// function ConfirmAnalyseModal({ product, onClose, onConfirm }) {
//   return (
//     <Modal title="Analyse Product" onClose={onClose}>
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
//           <ProductThumb images={product.images} />
//           <div className="min-w-0">
//             <p className="font-semibold text-on-surface text-[14px] truncate">
//               {product.title}
//             </p>
//             {product.productType && (
//               <p className="font-mono-sm text-mono-sm text-on-surface-variant">
//                 {product.productType}
//               </p>
//             )}
//             {product.vendor && (
//               <p className="font-mono-sm text-mono-sm text-on-surface-variant">
//                 {product.vendor}
//               </p>
//             )}
//           </div>
//         </div>
//         <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 flex flex-col gap-3">
//           <Eyebrow>What this analysis does</Eyebrow>
//           {[
//             {
//               icon: Brain,
//               label: "Stage 1 — Product Identity",
//               desc: "Interprets product, audience, use cases and attributes from all available signals",
//             },
//             {
//               icon: BarChart2,
//               label: "Stage 2 — AI Readiness Score",
//               desc: "Scores visibility across 6 dimensions, identifies missing signals and fixes",
//             },
//             {
//               icon: Eye,
//               label: "Stage 3 — Smart Prompts",
//               desc: "Generates product-specific prompts with win probability per AI engine",
//             },
//           ].map(({ icon: Ico, label, desc }) => (
//             <div key={label} className="flex items-start gap-3">
//               <Ico
//                 size={16}
//                 className="text-secondary shrink-0 mt-0.5"
//                 strokeWidth={1.8}
//               />
//               <div>
//                 <p className="text-[12px] font-semibold text-on-surface">
//                   {label}
//                 </p>
//                 <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-0.5">
//                   {desc}
//                 </p>
//               </div>
//             </div>
//           ))}
//           <Divider className="mt-1" />
//           <p className="font-mono-sm text-mono-sm text-on-surface-variant flex items-center gap-1.5">
//             <Clock4 size={12} strokeWidth={1.8} />
//             Takes 15–30 seconds · Uses AI tokens from your monthly quota
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={onConfirm}
//             className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-[13px] hover:opacity-90 transition-opacity"
//           >
//             <Zap size={15} strokeWidth={1.8} />
//             Run Analysis
//           </button>
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 rounded-xl font-bold text-[13px] border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// /* ═══ ANALYSE MODAL ════════════════════════════════════════════ */
// function AnalyseModal({ product, onClose, onDone }) {
//   const [phase, setPhase] = useState("queuing");
//   const [analysis, setAnalysis] = useState(null);
//   const [errMsg, setErrMsg] = useState(null);
//   const [pollCount, setPoll] = useState(0);
//   const pollRef = useRef(null),
//     timeoutRef = useRef(null);
//   const lastStatus = useRef(null),
//     running = useRef(false);

//   useEffect(() => {
//     startAnalysis();
//     return () => {
//       clearInterval(pollRef.current);
//       clearTimeout(timeoutRef.current);
//     };
//   }, []); // eslint-disable-line

//   async function startAnalysis() {
//     if (running.current) return;
//     running.current = true;
//     setPhase("queuing");
//     setErrMsg(null);
//     setPoll(0);
//     try {
//       const res = await productApi.analyse(product._id);
//       const jobId = res.data?.jobId;
//       if (!jobId && res.data?.usingCached) {
//         setAnalysis(res.data.analysis);
//         setPhase("done");
//         running.current = false;
//         return;
//       }
//       if (!jobId) throw new Error("No job ID returned");
//       setPhase("polling");
//       pollRef.current = setInterval(async () => {
//         try {
//           const status = await productApi.jobStatus(jobId);
//           const s = status.data?.status;
//           lastStatus.current = s;
//           setPoll((c) => c + 1);
//           if (s === "completed") {
//             clearInterval(pollRef.current);
//             clearTimeout(timeoutRef.current);
//             setTimeout(async () => {
//               const full = await productApi.get(product._id);
//               setAnalysis(full.data?.analysis);
//               setPhase("done");
//             }, 600);
//           } else if (s === "failed" || s === "not_found") {
//             clearInterval(pollRef.current);
//             clearTimeout(timeoutRef.current);
//             setErrMsg(status.data?.failReason || "Analysis failed.");
//             setPhase("error");
//             running.current = false;
//           }
//         } catch {
//           /* blip */
//         }
//       }, 2000);
//       timeoutRef.current = setTimeout(() => {
//         clearInterval(pollRef.current);
//         setErrMsg(
//           ["waiting", "delayed", "paused"].includes(lastStatus.current)
//             ? "Job queued — ensure npm run worker is running."
//             : "Analysis timed out.",
//         );
//         setPhase("error");
//         running.current = false;
//       }, 120_000);
//     } catch (e) {
//       setErrMsg(e.message);
//       setPhase("error");
//       running.current = false;
//     }
//   }

//   const stages = [
//     { label: "Stage 1 — Product Identity", doneAfter: 3 },
//     { label: "Stage 2 — AI Readiness Score", doneAfter: 8 },
//     { label: "Stage 3 — Smart Prompts", doneAfter: 12 },
//   ];

//   return (
//     <Modal title={`Analysing — ${product.title}`} onClose={onClose}>
//       {["queuing", "polling"].includes(phase) && (
//         <div className="flex flex-col gap-4">
//           {stages.map(({ label, doneAfter }, i) => {
//             const done = pollCount > doneAfter,
//               active = !done && pollCount >= i * 4;
//             return (
//               <div
//                 key={label}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${done ? "border-[#00e29e]/30 bg-[#00e29e]/5" : active ? "border-primary/30 bg-primary/5" : "border-outline-variant bg-surface-container-low"}`}
//               >
//                 {done ? (
//                   <CheckCircle2
//                     size={16}
//                     className="text-green-win shrink-0"
//                     strokeWidth={2}
//                   />
//                 ) : active ? (
//                   <Loader2
//                     size={16}
//                     className="animate-spin text-primary shrink-0"
//                     strokeWidth={2}
//                   />
//                 ) : (
//                   <div className="w-4 h-4 rounded-full border border-outline-variant shrink-0" />
//                 )}
//                 <span
//                   className={`text-[13px] font-semibold ${done ? "text-green-win" : active ? "text-on-surface" : "text-on-surface-variant"}`}
//                 >
//                   {label}
//                 </span>
//                 {done && (
//                   <span className="ml-auto font-mono-sm text-[10px] text-green-win">
//                     Done
//                   </span>
//                 )}
//               </div>
//             );
//           })}
//           <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center">
//             Takes 15–30 seconds · {pollCount} checks
//           </p>
//         </div>
//       )}
//       {phase === "error" && (
//         <div className="flex flex-col items-center gap-4 py-6">
//           <TriangleAlert size={40} className="text-error" strokeWidth={1.5} />
//           <p className="text-error text-[13px] font-semibold text-center">
//             {errMsg}
//           </p>
//           <button
//             onClick={() => {
//               running.current = false;
//               startAnalysis();
//             }}
//             className="px-6 py-2 rounded-xl font-bold border border-error/40 text-error bg-error/10 hover:bg-error/20 transition-all text-[13px]"
//           >
//             Retry
//           </button>
//         </div>
//       )}
//       {phase === "done" && analysis && (
//         <div className="flex flex-col gap-4">
//           <div className="rounded-2xl border border-[#00e29e]/20 bg-[#00e29e]/5 p-5 flex items-center gap-5">
//             <MiniScoreRing score={analysis.score} size={80} />
//             <div>
//               <Eyebrow>AI Readiness Score</Eyebrow>
//               <div
//                 className={`text-[32px] font-black leading-none mt-1 ${scoreTextClass(analysis.score)}`}
//               >
//                 {analysis.score}
//                 <span className="text-[16px] font-semibold text-on-surface-variant ml-1">
//                   /100
//                 </span>
//               </div>
//               {analysis.reasoning && (
//                 <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-2 max-w-xs">
//                   {analysis.reasoning}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-3 gap-3">
//             {[
//               {
//                 label: "Smart Prompts",
//                 value: analysis.smartPrompts?.prompts?.length ?? 0,
//                 cls: "text-on-surface",
//               },
//               {
//                 label: "Winnable Now",
//                 value:
//                   analysis.smartPrompts?.prompts?.filter(
//                     (p) => p.winProbability === "HIGH",
//                   ).length ?? 0,
//                 cls: "text-green-win",
//               },
//               {
//                 label: "High-Impact Fixes",
//                 value: (analysis.prioritizedFixes || []).filter(
//                   (f) => f.impact === "HIGH",
//                 ).length,
//                 cls: "text-error",
//               },
//             ].map(({ label, value, cls }) => (
//               <div
//                 key={label}
//                 className="rounded-xl border border-outline-variant bg-surface-container-low p-3 text-center"
//               >
//                 <div className={`text-[22px] font-black ${cls}`}>{value}</div>
//                 <p className="font-mono-sm text-[10px] text-on-surface-variant mt-0.5">
//                   {label}
//                 </p>
//               </div>
//             ))}
//           </div>
//           {analysis.prioritizedFixes?.filter((f) => f.impact === "HIGH")
//             .length > 0 && (
//             <div className="rounded-xl border border-error/20 bg-error/5 p-4">
//               <p className="font-mono-sm text-[10px] font-bold uppercase text-error mb-2">
//                 Top Fixes Required
//               </p>
//               {analysis.prioritizedFixes
//                 .filter((f) => f.impact === "HIGH")
//                 .slice(0, 2)
//                 .map((f, i) => (
//                   <div
//                     key={i}
//                     className="flex gap-2 py-1.5 font-mono-sm text-mono-sm text-error border-b border-outline-variant last:border-0"
//                   >
//                     <span className="shrink-0">{i + 1}.</span>
//                     <span>{f.fix}</span>
//                   </div>
//                 ))}
//             </div>
//           )}
//           <div className="flex gap-3">
//             <Link
//               to={`/app/products/${product._id}`}
//               onClick={() => onDone?.()}
//               className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-[13px] hover:opacity-90 transition-opacity"
//             >
//               <Eye size={15} strokeWidth={1.8} />
//               View Full Analysis
//             </Link>
//             <button
//               onClick={onClose}
//               className="px-5 py-2.5 rounded-xl font-bold text-[13px] border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </Modal>
//   );
// }

// /* ═══ OPTIMISE MODAL ═══════════════════════════════════════════ */
// function OptimiseModal({ product, onClose, onDone }) {
//   const [phase, setPhase] = useState("confirm");
//   const [errMsg, setErrMsg] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [previewLoading, setPreviewLoading] = useState(false);

//   useEffect(() => {
//     let cancelled = false;

//     async function loadPreview() {
//       if (!product?._id) return;
//       setPreviewLoading(true);
//       setPreview(null);

//       try {
//         const res = await productApi.get(product._id);
//         if (cancelled) return;

//         const detail = res?.data ?? res;
//         const analysis = detail?.analysis;
//         const currentDescription = stripHtml(
//           product.description ||
//             product.body_html ||
//             product.bodyHtml ||
//             product.descriptionHtml ||
//             "",
//         );

//         setPreview({
//           currentTitle: product.title || "Current title",
//           nextTitle:
//             analysis?.optimizedTitle || product.title || "Current title",
//           currentDescription:
//             currentDescription || "No product description available yet.",
//           nextDescription:
//             stripHtml(analysis?.optimizedDescription || "") ||
//             "A richer, AI-optimized description will be written.",
//           keywords: [
//             ...(analysis?.bestFor || []),
//             ...(analysis?.intentKeywords || []),
//           ]
//             .filter(Boolean)
//             .slice(0, 8),
//           faqs: (analysis?.faq || []).filter(Boolean).slice(0, 6),
//         });
//       } catch {
//         if (!cancelled) {
//           setPreview({
//             currentTitle: product.title || "Current title",
//             nextTitle: product.title || "Current title",
//             currentDescription:
//               stripHtml(
//                 product.description ||
//                   product.body_html ||
//                   product.bodyHtml ||
//                   product.descriptionHtml ||
//                   "",
//               ) || "No product description available yet.",
//             nextDescription: "Preview unavailable right now.",
//             keywords: [],
//             faqs: [],
//           });
//         }
//       } finally {
//         if (!cancelled) setPreviewLoading(false);
//       }
//     }

//     loadPreview();
//     return () => {
//       cancelled = true;
//     };
//   }, [product?._id]);

//   async function apply() {
//     setPhase("applying");
//     try {
//       await productApi.optimise(product._id);
//       setPhase("done");
//     } catch (e) {
//       setErrMsg(e.message);
//       setPhase("error");
//     }
//   }
//   return (
//     <Modal title="Apply to Shopify" onClose={onClose}>
//       {phase === "confirm" && (
//         <div className="flex flex-col gap-4">
//           <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
//             <p className="text-[13px] text-on-surface-variant leading-relaxed">
//               Push the AI-optimised title, description, tags and FAQ to your
//               Shopify product. Score:{" "}
//               <span
//                 className={`font-bold ${scoreTextClass(product.analysisScore)}`}
//               >
//                 {product.analysisScore}/100
//               </span>
//               .
//             </p>
//           </div>

//           <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
//             <p className="font-mono-sm text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
//               What will update on Shopify
//             </p>

//             {previewLoading ? (
//               <div className="flex items-center gap-2 text-sm text-on-surface-variant">
//                 <Loader2 size={14} className="animate-spin" strokeWidth={1.8} />
//                 Loading update preview…
//               </div>
//             ) : preview ? (
//               <div className="space-y-3">
//                 <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
//                   <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
//                     Title
//                   </p>
//                   <div className="mt-2 flex flex-col gap-1.5">
//                     <div>
//                       <p className="text-[10px] font-bold uppercase text-on-surface-variant">
//                         Current
//                       </p>
//                       <p className="text-sm text-on-surface">
//                         {preview.currentTitle}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-bold uppercase text-on-surface-variant">
//                         Will become
//                       </p>
//                       <p className="text-sm font-semibold text-on-surface">
//                         {preview.nextTitle}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
//                   <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
//                     Description
//                   </p>
//                   <div className="mt-2 flex flex-col gap-1.5">
//                     <div>
//                       <p className="text-[10px] font-bold uppercase text-on-surface-variant">
//                         Current
//                       </p>
//                       <p className="text-sm text-on-surface leading-6">
//                         {preview.currentDescription}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-bold uppercase text-on-surface-variant">
//                         Will become
//                       </p>
//                       <p className="text-sm text-on-surface leading-6">
//                         {preview.nextDescription}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
//                   <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
//                     Buyer-intent tags
//                   </p>
//                   {preview.keywords.length > 0 ? (
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {preview.keywords.map((item) => (
//                         <span
//                           key={item}
//                           className="rounded-full border border-outline-variant bg-surface-container-highest px-2.5 py-1 text-[11px] text-on-surface-variant"
//                         >
//                           {item}
//                         </span>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="mt-2 text-sm text-on-surface-variant">
//                       No extra keywords were generated for this product yet.
//                     </p>
//                   )}
//                 </div>

//                 {preview.faqs.length > 0 && (
//                   <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
//                     <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
//                       FAQ items to sync
//                     </p>
//                     <ul className="mt-2 space-y-1.5 text-sm text-on-surface">
//                       {preview.faqs.map((faq) => (
//                         <li key={faq.question || faq} className="flex gap-2">
//                           <span className="text-primary">•</span>
//                           <span>{faq.question || faq}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
//                   <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
//                     Shopify fields that will change
//                   </p>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {["Title", "Description", "Tags", "FAQ"].map((field) => (
//                       <span
//                         key={field}
//                         className="rounded-full border border-outline-variant bg-surface-container-highest px-2.5 py-1 text-[11px] text-on-surface-variant"
//                       >
//                         {field}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-sm text-on-surface-variant">
//                 No preview data is available for this product right now.
//               </p>
//             )}
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={apply}
//               className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-[13px] hover:opacity-90 transition-opacity"
//             >
//               <WandSparkles size={15} strokeWidth={1.8} />
//               Apply to Shopify
//             </button>
//             <button
//               onClick={onClose}
//               className="px-5 py-2.5 rounded-xl font-bold text-[13px] border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//       {phase === "applying" && (
//         <div className="flex flex-col items-center py-10 gap-4">
//           <Loader2
//             size={40}
//             className="animate-spin text-primary"
//             strokeWidth={1.5}
//           />
//           <p className="font-mono-sm text-mono-sm text-on-surface-variant">
//             Pushing to Shopify…
//           </p>
//         </div>
//       )}
//       {phase === "done" && (
//         <div className="flex flex-col items-center py-8 gap-4">
//           <CheckCircle2
//             size={52}
//             className="text-green-win"
//             strokeWidth={1.5}
//           />
//           <p className="font-headline-sm text-headline-sm text-green-win">
//             Applied!
//           </p>
//           <button
//             onClick={() => {
//               onDone?.();
//               onClose();
//             }}
//             className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-opacity text-[13px]"
//           >
//             Done →
//           </button>
//         </div>
//       )}
//       {phase === "error" && (
//         <div className="flex flex-col items-center py-8 gap-4">
//           <TriangleAlert size={40} className="text-error" strokeWidth={1.5} />
//           <p className="text-error text-[13px] font-semibold text-center">
//             {errMsg}
//           </p>
//           <button
//             onClick={() => setPhase("confirm")}
//             className="px-6 py-2 rounded-xl font-bold border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors text-[13px]"
//           >
//             Back
//           </button>
//         </div>
//       )}
//     </Modal>
//   );
// }

// /* ═══ SIMULATE MODAL ═══════════════════════════════════════════ */
// function SimulateModal({ product, onClose }) {
//   const [loading, setLoading] = useState(false),
//     [results, setResults] = useState([]),
//     [err, setErr] = useState(null),
//     [ran, setRan] = useState(false);
//   const PROMPTS = [
//     "Best product for my needs under budget",
//     "Top rated option for beginners",
//     "Best alternative to popular brands",
//   ];
//   async function run() {
//     setLoading(true);
//     setErr(null);
//     setResults([]);
//     try {
//       const settled = await Promise.allSettled(
//         PROMPTS.map((p) => promptApi.simulate(p, product._id)),
//       );
//       setResults(
//         settled.map((s, i) =>
//           s.status === "fulfilled"
//             ? {
//                 prompt: PROMPTS[i],
//                 score: s.value?.data?.recommendationScore ?? 0,
//                 likelihood: s.value?.data?.likelihood ?? "LOW",
//                 missingSignals: s.value?.data?.missingSignals ?? [],
//                 recommendations: s.value?.data?.recommendations ?? [],
//               }
//             : {
//                 prompt: PROMPTS[i],
//                 score: 0,
//                 likelihood: "LOW",
//                 missingSignals: ["Simulation failed"],
//                 recommendations: [],
//               },
//         ),
//       );
//       setRan(true);
//     } catch (e) {
//       setErr(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }
//   return (
//     <Modal
//       title={`Simulate — ${product.title}`}
//       onClose={onClose}
//       maxWidth="max-w-xl"
//     >
//       <p className="font-mono-sm text-mono-sm text-on-surface-variant mb-4">
//         Preview how ChatGPT, Perplexity &amp; Gemini would recommend this
//         product.
//       </p>
//       {!ran && !loading && (
//         <div className="flex flex-col items-center py-8 gap-4">
//           <Eye
//             size={28}
//             className="text-on-surface-variant"
//             strokeWidth={1.5}
//           />
//           <button
//             onClick={run}
//             className="px-7 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-[13px] hover:opacity-90 transition-opacity"
//           >
//             Run Simulation
//           </button>
//         </div>
//       )}
//       {loading && (
//         <div className="flex flex-col items-center py-8 gap-3">
//           <Loader2
//             size={36}
//             className="animate-spin text-primary"
//             strokeWidth={1.5}
//           />
//           <p className="font-mono-sm text-mono-sm text-on-surface-variant">
//             Running…
//           </p>
//         </div>
//       )}
//       {err && (
//         <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 font-mono-sm text-mono-sm text-error mb-4">
//           ⚠ {err}
//         </div>
//       )}
//       {!loading && results.length > 0 && (
//         <div className="flex flex-col gap-3">
//           {results.map((r) => {
//             const wc = winProbColors(
//               r.likelihood === "HIGH"
//                 ? "HIGH"
//                 : r.likelihood === "MED"
//                   ? "MEDIUM"
//                   : "LOW",
//             );
//             const scoreCls =
//               r.likelihood === "HIGH"
//                 ? "text-green-win"
//                 : r.likelihood === "MED"
//                   ? "text-on-tertiary-fixed-variant"
//                   : "text-error";
//             return (
//               <div
//                 key={r.prompt}
//                 className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
//               >
//                 <div className="flex items-start justify-between gap-3 mb-3">
//                   <p className="text-[13px] text-on-surface font-medium">
//                     {r.prompt}
//                   </p>
//                   <div className="flex items-center gap-2 shrink-0">
//                     <span
//                       className={`text-[22px] font-black font-mono-sm ${scoreCls}`}
//                     >
//                       {r.score}
//                     </span>
//                     <span
//                       className={`font-mono-sm text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${wc.text} ${wc.bg} ${wc.border}`}
//                     >
//                       {r.likelihood}
//                     </span>
//                   </div>
//                 </div>
//                 {r.missingSignals.length > 0 && (
//                   <div className="mb-2">
//                     <p className="font-mono-sm text-[10px] font-bold uppercase text-error mb-1">
//                       Missing
//                     </p>
//                     {r.missingSignals.slice(0, 2).map((m) => (
//                       <div
//                         key={m}
//                         className="font-mono-sm text-mono-sm text-error flex gap-2 py-0.5"
//                       >
//                         <span>⚠</span>
//                         {m}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {r.recommendations.length > 0 && (
//                   <div>
//                     <p className="font-mono-sm text-[10px] font-bold uppercase text-green-win mb-1">
//                       Fix
//                     </p>
//                     {r.recommendations.slice(0, 2).map((rec) => (
//                       <div
//                         key={rec}
//                         className="font-mono-sm text-mono-sm text-on-surface flex gap-2 py-0.5"
//                       >
//                         <span className="text-green-win">→</span>
//                         {rec}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//           <button
//             onClick={run}
//             className="self-start px-5 py-2 rounded-xl font-bold text-[12px] border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors"
//           >
//             Re-run
//           </button>
//         </div>
//       )}
//     </Modal>
//   );
// }

// /* ═══ PRODUCT ROW ══════════════════════════════════════════════ */
// function ProductRow({ product, onConfirmAnalyse, onOptimise, onSimulate }) {
//   const sc = product.analysisScore,
//     hasData = sc != null;
//   const detailHref = `/app/products/${product._id}`;

//   const rowContent = (
//     <>
//       <td className="px-5 py-3.5">
//         <div className="flex items-center gap-3">
//           <ProductThumb images={product.images} />
//           <div className="min-w-0">
//             <p className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors truncate max-w-[200px]">
//               {product.title}
//             </p>
//             <div className="flex items-center gap-2 mt-0.5 flex-wrap">
//               {(product.productCategory || product.vendor) && (
//                 <span className="font-mono-sm text-mono-sm text-on-surface-variant truncate max-w-[160px]">
//                   {product.productCategory || product.vendor}
//                 </span>
//               )}
//               <StatusBadge
//                 analysisScore={sc}
//                 isOptimized={product.isOptimized}
//               />
//             </div>
//           </div>
//         </div>
//       </td>
//       <td className="px-4 py-3.5">
//         <span className="px-2 py-0.5 rounded-lg bg-surface-container-highest font-mono-sm text-mono-sm text-on-surface-variant">
//           {product.productType || "—"}
//         </span>
//       </td>
//       <td className="px-4 py-3.5">
//         {hasData ? (
//           <div style={{ width: 140 }}>
//             <div className="flex justify-between mb-1.5">
//               <span
//                 className={`font-mono-sm text-mono-sm font-bold ${scoreTextClass(sc)}`}
//               >
//                 {sc}%
//               </span>
//               <span className="font-mono-sm text-mono-sm text-on-surface-variant">
//                 {scoreLabel(sc)}
//               </span>
//             </div>
//             <div className="h-[3px] w-full bg-surface-container-highest rounded-full overflow-hidden">
//               <div
//                 className={`h-full rounded-full ${scoreBarClass(sc)}`}
//                 style={{ width: `${sc}%` }}
//               />
//             </div>
//           </div>
//         ) : (
//           <span className="font-mono-sm text-mono-sm text-on-surface-variant">
//             Not analysed
//           </span>
//         )}
//       </td>
//       <td className="px-4 py-3.5">
//         <div className="flex flex-wrap gap-1.5">
//           {!product.lastIssues?.length ? (
//             <span className="font-mono-sm text-[10px] px-2 py-0.5 rounded border border-outline-variant/50 text-on-surface-variant">
//               {hasData ? "None" : "—"}
//             </span>
//           ) : (
//             product.lastIssues.slice(0, 2).map((label, i) => (
//               <span
//                 key={i}
//                 className="font-mono-sm text-[10px] px-2 py-0.5 rounded flex items-center gap-1 bg-error/8 border border-error/20 text-error"
//               >
//                 <span className="w-1 h-1 rounded-full bg-error animate-pulse shrink-0" />
//                 {label}
//               </span>
//             ))
//           )}
//         </div>
//       </td>
//       <td className="px-4 py-3.5 text-right">
//         <div
//           className="flex items-center justify-end gap-1.5"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onSimulate();
//             }}
//             className="px-3 py-1.5 rounded-lg font-mono-sm text-[11px] font-semibold border border-outline-variant text-on-surface-variant bg-surface-container hover:text-on-surface transition-colors"
//           >
//             Simulate
//           </button>
//           <ActionButton
//             product={product}
//             onConfirmAnalyse={onConfirmAnalyse}
//             onOptimise={onOptimise}
//           />
//           {hasData && (
//             <Link
//               to={detailHref}
//               onClick={(e) => e.stopPropagation()}
//               className="px-3 py-1.5 rounded-lg font-mono-sm text-[11px] font-semibold border border-outline-variant text-on-surface-variant bg-surface-container hover:text-on-surface transition-colors"
//             >
//               View
//             </Link>
//           )}
//         </div>
//       </td>
//     </>
//   );

//   if (hasData) {
//     return (
//       <tr
//         className="hover:bg-surface-container-low/60 transition-colors group border-b border-outline-variant last:border-0 cursor-pointer"
//         onClick={(e) => {
//           if (e.target.closest("button") || e.target.closest("a")) return;
//           window.location = detailHref;
//         }}
//       >
//         {rowContent}
//       </tr>
//     );
//   }
//   return (
//     <tr
//       onClick={onConfirmAnalyse}
//       className="hover:bg-surface-container-low/60 transition-colors group cursor-pointer border-b border-outline-variant last:border-0"
//     >
//       {rowContent}
//     </tr>
//   );
// }

// /* ═══ STAT TILE ════════════════════════════════════════════════ */
// function StatTile({
//   icon: Ico,
//   label,
//   value,
//   loading,
//   accentLeft = "",
//   valueClass = "",
// }) {
//   return (
//     <Card className={`flex items-center gap-4 px-5 py-4 ${accentLeft}`}>
//       <Ico
//         size={20}
//         className={`shrink-0 ${valueClass || "text-on-surface-variant"}`}
//         strokeWidth={1.8}
//       />
//       <div>
//         <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-wide">
//           {label}
//         </p>
//         <p
//           className={`font-display-lg text-[26px] font-bold leading-none mt-0.5 ${valueClass || "text-on-surface"}`}
//         >
//           {loading ? "—" : (value ?? "—")}
//         </p>
//       </div>
//     </Card>
//   );
// }

// export const loader = async () => null;

// /* ═══ PRODUCTS PAGE ════════════════════════════════════════════ */
// export default function Products() {
//   const token = localStorage.getItem("recomind_token");

//   const [page, setPage] = useState(1),
//     [sort, setSort] = useState("score_asc");
//   const [statusFilter, setStatusFilter] = useState("all"),
//     [query, setQuery] = useState("");
//   const [confirmTarget, setConfirmTarget] = useState(null),
//     [analyseTarget, setAnalyseTarget] = useState(null);
//   const [optimiseTarget, setOptimiseTarget] = useState(null),
//     [simulateTarget, setSimulateTarget] = useState(null);
//   const [toast, setToast] = useState(null),
//     [syncLoading, setSyncLoading] = useState(false),
//     [bulkLoading, setBulkLoading] = useState(false);

//   const dq = useDebounced(query, 220);
//   const params = { page, sort, limit: 25 };
//   if (statusFilter === "optimized") params.optimized = "true";
//   if (statusFilter === "unoptimized") params.optimized = "false";

//   const { data, loading, error, refetch } = useApi(
//     token ? () => productApi.list(params) : null,
//     [token, page, sort, statusFilter],
//   );
//   const { data: countAll } = useApi(
//     token ? () => productApi.list({ page: 1, limit: 20 }) : null,
//     [token],
//   );

//   console.log("countAll", countAll);
//   const { data: countOpt } = useApi(
//     token
//       ? () => productApi.list({ page: 1, limit: 1, optimized: "true" })
//       : null,
//     [token],
//   );
//   const { data: countUnopt } = useApi(
//     token
//       ? () => productApi.list({ page: 1, limit: 20, optimized: "false" })
//       : null,
//     [token],
//   );

//   function showToast(msg, type = "success") {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   }
//   async function handleSync() {
//     setSyncLoading(true);
//     try {
//       const r = await productApi.sync();
//       showToast(r.message || "Products synced");
//       refetch();
//     } catch (e) {
//       showToast(e.message, "error");
//     } finally {
//       setSyncLoading(false);
//     }
//   }
//   async function handleBulkAnalyse() {
//     setBulkLoading(true);
//     try {
//       const r = await productApi.analyseBulk();
//       showToast(r.message || "Bulk analysis queued");
//     } catch (e) {
//       showToast(e.message, "error");
//     } finally {
//       setBulkLoading(false);
//     }
//   }

//   const products = data?.data ?? (Array.isArray(data) ? data : []);
//   const pagination = data?.pagination;
//   const totalCount = countAll?.pagination?.total ?? "—";
//   const optCount = countOpt?.pagination?.total ?? "—";
//   const unoptCount = countUnopt?.pagination?.total ?? "—";
//   const avgScore = data?.avgScore,
//     critCount = data?.criticalCount;
//   const thisTabTotal = pagination?.total ?? products.length;

//   const filtered = products.filter((p) => {
//     const q = dq.trim().toLowerCase();
//     return (
//       !q ||
//       [p.title, p.vendor, p.productType]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase()
//         .includes(q)
//     );
//   });

//   const tabItems = [
//     { key: "all", label: "All Products", badge: totalCount },
//     { key: "optimized", label: "Optimized", badge: optCount },
//     { key: "unoptimized", label: "Unoptimized", badge: unoptCount },
//   ];

//   return (
//     <div className="space-y-4">
//       {toast && <Toast msg={toast.msg} type={toast.type} />}

//       <PageHeader
//         title="Product Inventory"
//         subtitle="Manage and optimize AI visibility across your commerce ecosystem."
//         actions={
//           <>
//             <button
//               onClick={handleSync}
//               disabled={syncLoading}
//               className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-on-surface hover:brightness-95 transition-all disabled:opacity-50 font-label-md text-label-md"
//             >
//               {syncLoading ? (
//                 <Loader2
//                   size={16}
//                   className="animate-spin shrink-0"
//                   strokeWidth={1.8}
//                 />
//               ) : (
//                 <RotateCcw size={16} strokeWidth={1.8} className="shrink-0" />
//               )}
//               Sync Shopify
//             </button>
//             <button
//               onClick={handleBulkAnalyse}
//               disabled={bulkLoading}
//               className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(17,24,68,0.35)] disabled:opacity-50 font-label-md text-label-md"
//             >
//               {bulkLoading ? (
//                 <Loader2
//                   size={16}
//                   className="animate-spin shrink-0"
//                   strokeWidth={1.8}
//                 />
//               ) : (
//                 <Zap size={16} strokeWidth={1.8} className="shrink-0" />
//               )}
//               Bulk Analyse
//             </button>
//           </>
//         }
//       />

//       {/* Stat tiles */}
//       <div className="grid grid-cols-4 gap-4">
//         <StatTile
//           icon={Package}
//           label="Total SKUs"
//           value={totalCount}
//           loading={loading}
//         />
//         <StatTile
//           icon={CheckCircle2}
//           label="Avg AI Score"
//           value={avgScore != null ? `${avgScore}%` : "—"}
//           loading={loading}
//         />
//         <StatTile
//           icon={TriangleAlert}
//           label="Critical Issues"
//           value={critCount}
//           loading={loading}
//           accentLeft="border-l-2 border-l-error"
//           valueClass="text-error"
//         />
//         <StatTile
//           icon={Zap}
//           label="Optimised"
//           value={optCount}
//           loading={loading}
//           accentLeft="border-l-2 border-l-[#00e29e]"
//           valueClass="text-green-win"
//         />
//       </div>

//       {/* Tabs + search */}
//       <div className="flex items-center justify-between gap-1 ">
//         <PillTabs
//           items={tabItems}
//           value={statusFilter}
//           onChange={(k) => {
//             setStatusFilter(k);
//             setPage(1);
//           }}
//         />
//         <div className="flex items-center gap-1">
//           <div className="relative ">
//             <Search
//               size={14}
//               className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
//               strokeWidth={1.8}
//             />
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search products…"
//               className="pl-8 py-2 rounded-xl w-70 font-mono-sm text-mono-sm outline-none  bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:border-outline transition-colors"
//             />
//           </div>
//           <div className="flex items-center gap-0.5 font-mono-sm text-mono-sm glass-card rounded-xl px-2 py-1">
//             <ArrowUpDown
//               size={14}
//               strokeWidth={1.8}
//               className="text-on-surface-variant "
//             />
//             <select
//               value={sort}
//               onChange={(e) => {
//                 setSort(e.target.value);
//                 setPage(1);
//               }}
//               className="bg-transparent py-1 max-w-30 font-mono-sm text-mono-sm font-semibold text-on-surface cursor-pointer outline-none"
//             >
//               <option value="score_asc">Low to High</option>
//               <option value="score_desc">High to Low</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <Card className="overflow-x-auto">
//         <div className="min-w-full">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-surface-container-low">
//                 {[
//                   "Product",
//                   "Category",
//                   "AI Readiness",
//                   "Issues",
//                   "Actions",
//                 ].map((h, i) => (
//                   <th
//                     key={h}
//                     className={`px-5 py-3 font-mono-sm text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.12em] whitespace-nowrap ${i === 4 ? "text-right" : ""}`}
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={5} className="py-16 text-center">
//                     <div className="flex flex-col items-center gap-3">
//                       {/* <Loader2
//                         size={28}
//                         className="animate-spin text-on-surface-variant"
//                         strokeWidth={1.5}
//                       />
//                       <span className="font-mono-sm text-mono-sm text-on-surface-variant">
//                         Loading products…
//                       </span> */}
//                       <AiSpinner label="Loading Products" />
//                     </div>
//                   </td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan={5} className="py-16 text-center">
//                     <div className="flex flex-col items-center gap-4">
//                       <TriangleAlert
//                         size={40}
//                         className="text-error"
//                         strokeWidth={1.5}
//                       />
//                       <span className="font-mono-sm text-mono-sm text-error">
//                         {error}
//                       </span>
//                       <button
//                         onClick={refetch}
//                         className="px-5 py-2 rounded-xl font-bold border border-error/40 bg-error/10 text-error font-mono-sm text-mono-sm"
//                       >
//                         Retry
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="py-16 text-center">
//                     <div className="flex flex-col items-center gap-4">
//                       <Package
//                         size={44}
//                         className="text-on-surface-variant"
//                         strokeWidth={1.5}
//                       />
//                       <p className="font-mono-sm text-mono-sm text-on-surface-variant">
//                         {dq
//                           ? `No products match "${dq}"`
//                           : "No products yet. Sync your Shopify store."}
//                       </p>
//                       {!dq && (
//                         <button
//                           onClick={handleSync}
//                           disabled={syncLoading}
//                           className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 disabled:opacity-50 font-mono-sm text-mono-sm"
//                         >
//                           {syncLoading ? (
//                             <Loader2
//                               size={14}
//                               className="animate-spin"
//                               strokeWidth={1.8}
//                             />
//                           ) : (
//                             <RotateCcw size={14} strokeWidth={1.8} />
//                           )}
//                           Sync Now
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((p) => (
//                   <ProductRow
//                     key={p._id}
//                     product={p}
//                     onConfirmAnalyse={() => setConfirmTarget(p)}
//                     onOptimise={() => setOptimiseTarget(p)}
//                     onSimulate={() => setSimulateTarget(p)}
//                   />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         <Divider />
//         <div className="px-5 py-3 flex items-center justify-between">
//           <p className="font-mono-sm text-mono-sm text-on-surface-variant">
//             Showing{" "}
//             <span className="font-bold text-on-surface">
//               {filtered.length === 0
//                 ? 0
//                 : `${(page - 1) * 25 + 1}–${Math.min(page * 25, thisTabTotal)}`}
//             </span>{" "}
//             of <span className="font-bold text-on-surface">{thisTabTotal}</span>
//           </p>
//           {pagination && pagination.totalPages > 1 && (
//             <div className="flex items-center gap-1.5">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-30 transition-colors"
//               >
//                 <ChevronLeft size={16} strokeWidth={2} />
//               </button>
//               {Array.from(
//                 { length: Math.min(5, pagination.totalPages) },
//                 (_, i) => i + 1,
//               ).map((pg) => (
//                 <button
//                   key={pg}
//                   onClick={() => setPage(pg)}
//                   className={`w-7 h-7 rounded-lg font-mono-sm text-[11px] font-bold transition-colors ${page === pg ? "bg-primary text-on-primary" : "hover:bg-surface-container text-on-surface"}`}
//                 >
//                   {pg}
//                 </button>
//               ))}
//               {pagination.totalPages > 5 && (
//                 <span className="font-mono-sm text-mono-sm text-on-surface-variant px-1">
//                   …
//                 </span>
//               )}
//               <button
//                 disabled={page === pagination.totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-30 transition-colors"
//               >
//                 <ChevronRight size={16} strokeWidth={2} />
//               </button>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Bottom panels */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <Card className="lg:col-span-2 p-6 relative overflow-hidden group">
//           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
//             <BarChart2 size={120} strokeWidth={1} />
//           </div>
//           <div className="relative z-10">
//             <div className="flex items-center gap-2 mb-1">
//               <Brain
//                 size={18}
//                 className="text-secondary shrink-0"
//                 strokeWidth={1.8}
//               />
//               <Eyebrow>Intelligence</Eyebrow>
//             </div>
//             <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
//               Global Visibility Intelligence
//             </h3>
//             <p className="text-on-surface-variant mb-5 max-w-lg">
//               {critCount > 0 ? (
//                 <>
//                   <span className="text-error font-bold">
//                     {critCount} products
//                   </span>{" "}
//                   are critically under-optimised. Run Bulk Analysis to generate
//                   interpretations and smart prompts.
//                 </>
//               ) : (
//                 "Your catalog is in good shape. Run Bulk Analysis to refresh AI scores and regenerate smart prompts."
//               )}
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleBulkAnalyse}
//                 disabled={bulkLoading}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-label-md text-label-md"
//               >
//                 {bulkLoading ? (
//                   <Loader2
//                     size={15}
//                     className="animate-spin"
//                     strokeWidth={1.8}
//                   />
//                 ) : (
//                   <Play size={15} strokeWidth={1.8} />
//                 )}
//                 Run Bulk Analysis
//               </button>
//               <button className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container transition-colors font-label-md text-label-md">
//                 <Download size={15} strokeWidth={1.8} />
//                 Export Report
//               </button>
//             </div>
//           </div>
//         </Card>
//         <Card className="p-6 border-l-4 border-l-primary">
//           <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
//             Recent Optimizations
//           </h3>
//           {products.filter((p) => p.isOptimized).length === 0 ? (
//             <div className="flex flex-col items-center gap-3 py-6">
//               <CheckCircle2
//                 size={32}
//                 className="text-on-surface-variant"
//                 strokeWidth={1.5}
//               />
//               <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center">
//                 No products optimised yet.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {products
//                 .filter((p) => p.isOptimized)
//                 .slice(0, 4)
//                 .map((p) => (
//                   <Link
//                     key={p._id}
//                     to={`/app/products/${p._id}`}
//                     className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
//                   >
//                     <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <p className="font-mono-sm text-[12px] font-bold text-on-surface truncate">
//                         {p.title}
//                       </p>
//                       <p className="font-mono-sm text-mono-sm text-on-surface-variant">
//                         Score:{" "}
//                         {p.analysisScore != null ? `${p.analysisScore}%` : "—"}
//                       </p>
//                     </div>
//                     <ChevronRight
//                       size={14}
//                       className="text-on-surface-variant"
//                       strokeWidth={2}
//                     />
//                   </Link>
//                 ))}
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Modals */}
//       {confirmTarget && !analyseTarget && (
//         <ConfirmAnalyseModal
//           product={confirmTarget}
//           onClose={() => setConfirmTarget(null)}
//           onConfirm={() => {
//             setAnalyseTarget(confirmTarget);
//             setConfirmTarget(null);
//           }}
//         />
//       )}
//       {analyseTarget && (
//         <AnalyseModal
//           product={analyseTarget}
//           onClose={() => setAnalyseTarget(null)}
//           onDone={() => {
//             setAnalyseTarget(null);
//             refetch();
//           }}
//         />
//       )}
//       {optimiseTarget && (
//         <OptimiseModal
//           product={optimiseTarget}
//           onClose={() => setOptimiseTarget(null)}
//           onDone={() => refetch()}
//         />
//       )}
//       {simulateTarget && (
//         <SimulateModal
//           product={simulateTarget}
//           onClose={() => setSimulateTarget(null)}
//         />
//       )}
//     </div>
//   );
// }

// export const headers = (headersArgs) => boundary.headers(headersArgs);

// app/routes/app.products.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { productApi, promptApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { useAnalysisTracker } from "../context/AnalysisTrackerContext";
import AiSpinner from "../components/loader/AiSpinner";
import Pagination from "../components/Pagination";
import {
  Card,
  Divider,
  Eyebrow,
  PageHeader,
  PillTabs,
  Modal,
  Toast,
  StatusBadge,
  ProductThumb,
  MiniScoreRing,
  useDebounced,
  scoreColor,
  scoreTextClass,
  scoreBarClass,
  scoreLabel,
  winProbColors,
} from "../components/UI";
import {
  Package,
  CheckCircle2,
  TriangleAlert,
  Clock4,
  Zap,
  RotateCcw,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Diamond,
  Brain,
  Play,
  Eye,
  WandSparkles,
  BarChart2,
  Trash2,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/Authcontext";

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ─── Bulk analyse button — shows a live progress bar in place of the
   button itself while a batch is running, in either visual variant ──── */
function BulkAnalyseButton({ onClick, starting, variant = "compact" }) {
  const { activeBatch } = useAnalysisTracker();

  if (activeBatch) {
    const pct = Math.round(
      ((activeBatch.completed + activeBatch.failed) / activeBatch.total) * 100,
    );
    const label = `Analysing ${activeBatch.completed + activeBatch.failed}/${activeBatch.total}…`;
    if (variant === "cta") {
      return (
        <div className="flex flex-col gap-1.5 min-w-[220px]  cursor-pointer">
          <div className="flex items-center gap-2 font-mono-sm text-[12px] font-bold text-on-surface ">
            <Loader2
              size={14}
              className="animate-spin text-primary shrink-0"
              strokeWidth={2}
            />
            {label}
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1 min-w-[160px] px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/25">
        <span className="flex items-center gap-1.5 font-label-md text-[11px] font-bold text-primary">
          <Loader2
            size={12}
            className="animate-spin shrink-0"
            strokeWidth={2.2}
          />
          {label}
        </span>
        <div className="h-1 w-full bg-primary/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === "cta") {
    return (
      <button
        onClick={onClick}
        disabled={starting}
        className="flex items-center gap-2 px-5 py-2.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-label-md text-label-md cursor-pointer"
      >
        {starting ? (
          <Loader2 size={15} className="animate-spin" strokeWidth={1.8} />
        ) : (
          <Play size={15} strokeWidth={1.8} />
        )}
        Run Bulk Analysis
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={starting}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(17,24,68,0.35)] disabled:opacity-50 font-label-md text-label-md cursor-pointer"
    >
      {starting ? (
        <Loader2
          size={16}
          className="animate-spin shrink-0"
          strokeWidth={1.8}
        />
      ) : (
        <Zap size={16} strokeWidth={1.8} className="shrink-0" />
      )}
      Bulk Analyse
    </button>
  );
}

/* ─── Action button — three states based on product progress ──────────── */
function ActionButton({ product, onConfirmAnalyse, onOptimise }) {
  const { getProductJob } = useAnalysisTracker();
  const activeJob = getProductJob(product._id);

  if (activeJob) {
    return (
      <span className="h-8 inline-flex items-center gap-1.5 whitespace-nowrap px-3 rounded-lg font-mono-sm text-[11px] font-semibold bg-primary/10 text-primary border border-primary/25 cursor-pointer">
        <Loader2
          size={12}
          className="animate-spin shrink-0"
          strokeWidth={2.2}
        />
        Analysing…
      </span>
    );
  }

  if (product.analysisScore == null)
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onConfirmAnalyse();
        }}
        className="h-8 inline-flex items-center whitespace-nowrap px-3 rounded-lg font-mono-sm text-[11px] font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity cursor-pointer"
      >
        Analyse
      </button>
    );
  if (!product.isOptimized)
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOptimise();
        }}
        className="h-8 inline-flex items-center whitespace-nowrap px-3 rounded-lg font-mono-sm text-[11px] font-semibold bg-secondary-container text-on-secondary-container border border-secondary-fixed/30 hover:opacity-90 transition-opacity cursor-pointer"
      >
        Optimise
      </button>
    );
  // Re-analysis is now always available via the row's own "Re-analyze"
  // button (independent of optimization status) — so once a product is
  // optimized, there's nothing actionable left for this button to do.
  // Just confirm the state instead of duplicating that action.
  return (
    <span className="h-8 inline-flex items-center gap-1.5 whitespace-nowrap px-3 rounded-lg font-mono-sm text-[11px] font-semibold text-green-win bg-[#00e29e]/10 border border-[#00e29e]/25  cursor-pointer">
      <CheckCircle2 size={13} strokeWidth={2.2} />
      Optimized
    </span>
  );
}

/* ═══ CONFIRM ANALYSE MODAL ════════════════════════════════════ */
function ConfirmAnalyseModal({ product, onClose, onConfirm }) {
  return (
    <Modal title="Analyse Product" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <ProductThumb images={product.images} />
          <div className="min-w-0">
            <p className="font-semibold text-on-surface text-[14px] truncate">
              {product.title}
            </p>
            {product.productType && (
              <p className="font-mono-sm text-mono-sm text-on-surface-variant">
                {product.productType}
              </p>
            )}
            {product.vendor && (
              <p className="font-mono-sm text-mono-sm text-on-surface-variant">
                {product.vendor}
              </p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 flex flex-col gap-3">
          <Eyebrow>What this analysis does</Eyebrow>
          {[
            {
              icon: Brain,
              label: "Stage 1 — Product Identity",
              desc: "Interprets product, audience, use cases and attributes from all available signals",
            },
            {
              icon: BarChart2,
              label: "Stage 2 — AI Readiness Score",
              desc: "Scores visibility across 6 dimensions, identifies missing signals and fixes",
            },
            {
              icon: Eye,
              label: "Stage 3 — Smart Prompts",
              desc: "Generates product-specific prompts with win probability per AI engine",
            },
          ].map(({ icon: Ico, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <Ico
                size={16}
                className="text-secondary shrink-0 mt-0.5"
                strokeWidth={1.8}
              />
              <div>
                <p className="text-[12px] font-semibold text-on-surface">
                  {label}
                </p>
                <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-0.5">
                  {desc}
                </p>
              </div>
            </div>
          ))}
          <Divider className="mt-1" />
          <p className="font-mono-sm text-mono-sm text-on-surface-variant flex items-center gap-1.5">
            <Clock4 size={12} strokeWidth={1.8} />
            Takes 15–30 seconds · Uses AI tokens from your monthly quota
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-[13px] hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Zap size={15} strokeWidth={1.8} />
            Run Analysis
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-[13px] border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══ ANALYSE MODAL ════════════════════════════════════════════ */
function AnalyseModal({ product, onClose, onDone }) {
  const { startSingleAnalysis, jobs, getProductJob } = useAnalysisTracker();
  const [jobId, setJobId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [phase, setPhase] = useState("queuing"); // queuing | polling | done | error
  const startedRef = useRef(false);
  const fetchedRef = useRef(false);

  async function beginTracking() {
    startedRef.current = true;
    setErrMsg(null);
    // If a job is already tracked for this product (e.g. the modal was
    // reopened, or this product was swept up in a bulk run), attach to
    // it instead of starting a duplicate analysis.
    const existing = getProductJob(product._id);
    if (existing) {
      setJobId(existing.jobId);
      setPhase("polling");
      return;
    }
    try {
      const res = await startSingleAnalysis(product);
      if (res.usingCached) {
        setAnalysis(res.analysis);
        setPhase("done");
        return;
      }
      setJobId(res.jobId);
      setPhase("polling");
    } catch (e) {
      setErrMsg(e.message);
      setPhase("error");
    }
  }

  useEffect(() => {
    if (startedRef.current) return;
    beginTracking();
  }, []); // eslint-disable-line

  // This job keeps polling in the global tracker even if this modal
  // unmounts — closing the modal never stops or resets progress. We just
  // read whatever the tracker currently knows about it.
  const job = jobId ? jobs[jobId] : null;
  const pollCount = job?.pollCount ?? 0;

  useEffect(() => {
    if (!job || fetchedRef.current) return;
    if (job.status === "completed") {
      fetchedRef.current = true;
      (async () => {
        const full = await productApi.get(product._id);
        setAnalysis(full.data?.analysis);
        setPhase("done");
      })();
    } else if (job.status === "failed") {
      fetchedRef.current = true;
      setErrMsg(job.failReason || "Analysis failed.");
      setPhase("error");
    }
  }, [job?.status]); // eslint-disable-line

  function retry() {
    startedRef.current = false;
    fetchedRef.current = false;
    setAnalysis(null);
    setJobId(null);
    setPhase("queuing");
    beginTracking();
  }

  const stages = [
    { label: "Stage 1 — Product Identity", doneAfter: 3 },
    { label: "Stage 2 — AI Readiness Score", doneAfter: 8 },
    { label: "Stage 3 — Smart Prompts", doneAfter: 12 },
  ];

  return (
    <Modal title={`Analysing — ${product.title}`} onClose={onClose}>
      {["queuing", "polling"].includes(phase) && (
        <div className="flex flex-col gap-4">
          {stages.map(({ label, doneAfter }, i) => {
            const done = pollCount > doneAfter,
              active = !done && pollCount >= i * 4;
            return (
              <div
                key={label}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${done ? "border-[#00e29e]/30 bg-[#00e29e]/5" : active ? "border-primary/30 bg-primary/5" : "border-outline-variant bg-surface-container-low"}`}
              >
                {done ? (
                  <CheckCircle2
                    size={16}
                    className="text-green-win shrink-0"
                    strokeWidth={2}
                  />
                ) : active ? (
                  <Loader2
                    size={16}
                    className="animate-spin text-primary shrink-0"
                    strokeWidth={2}
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-outline-variant shrink-0" />
                )}
                <span
                  className={`text-[13px] font-semibold ${done ? "text-green-win" : active ? "text-on-surface" : "text-on-surface-variant"}`}
                >
                  {label}
                </span>
                {done && (
                  <span className="ml-auto font-mono-sm text-[10px] text-green-win">
                    Done
                  </span>
                )}
              </div>
            );
          })}
          <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center">
            Takes 15–30 seconds · {pollCount} checks
          </p>
          <button
            onClick={onClose}
            className="self-center font-mono-sm text-[11px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Close — keep analysing in the background
          </button>
        </div>
      )}
      {phase === "error" && (
        <div className="flex flex-col items-center gap-4 py-6">
          <TriangleAlert size={40} className="text-error" strokeWidth={1.5} />
          <p className="text-error text-[13px] font-semibold text-center">
            {errMsg}
          </p>
          <button
            onClick={retry}
            className="px-6 py-2 rounded-xl font-bold border border-error/40 text-error bg-error/10 hover:bg-error/20 transition-all text-[13px]"
          >
            Retry
          </button>
        </div>
      )}
      {phase === "done" && analysis && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[#00e29e]/20 bg-[#00e29e]/5 p-5 flex items-center gap-5">
            <MiniScoreRing score={analysis.score} size={80} />
            <div>
              <Eyebrow>AI Readiness Score</Eyebrow>
              <div
                className={`text-[32px] font-black leading-none mt-1 ${scoreTextClass(analysis.score)}`}
              >
                {analysis.score}
                <span className="text-[16px] font-semibold text-on-surface-variant ml-1">
                  /100
                </span>
              </div>
              {analysis.reasoning && (
                <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-2 max-w-xs">
                  {analysis.reasoning}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Smart Prompts",
                value: analysis.smartPrompts?.prompts?.length ?? 0,
                cls: "text-on-surface",
              },
              {
                label: "Winnable Now",
                value:
                  analysis.smartPrompts?.prompts?.filter(
                    (p) => p.winProbability === "HIGH",
                  ).length ?? 0,
                cls: "text-green-win",
              },
              {
                label: "High-Impact Fixes",
                value: (analysis.prioritizedFixes || []).filter(
                  (f) => f.impact === "HIGH",
                ).length,
                cls: "text-error",
              },
            ].map(({ label, value, cls }) => (
              <div
                key={label}
                className="rounded-xl border border-outline-variant bg-surface-container-low p-3 text-center"
              >
                <div className={`text-[22px] font-black ${cls}`}>{value}</div>
                <p className="font-mono-sm text-[10px] text-on-surface-variant mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
          {analysis.prioritizedFixes?.filter((f) => f.impact === "HIGH")
            .length > 0 && (
            <div className="rounded-xl border border-error/20 bg-error/5 p-4">
              <p className="font-mono-sm text-[10px] font-bold uppercase text-error mb-2">
                Top Fixes Required
              </p>
              {analysis.prioritizedFixes
                .filter((f) => f.impact === "HIGH")
                .slice(0, 2)
                .map((f, i) => (
                  <div
                    key={i}
                    className="flex gap-2 py-1.5 font-mono-sm text-mono-sm text-error border-b border-outline-variant last:border-0"
                  >
                    <span className="shrink-0">{i + 1}.</span>
                    <span>{f.fix}</span>
                  </div>
                ))}
            </div>
          )}
          <div className="flex gap-3">
            <Link
              to={`/app/products/${product._id}`}
              onClick={() => onDone?.()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-[13px] hover:opacity-90 transition-opacity"
            >
              <Eye size={15} strokeWidth={1.8} />
              View Full Analysis
            </Link>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-[13px] border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ═══ OPTIMISE MODAL ═══════════════════════════════════════════ */
function OptimiseModal({ product, onClose, onDone }) {
  const [phase, setPhase] = useState("confirm");
  const [errMsg, setErrMsg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      if (!product?._id) return;
      setPreviewLoading(true);
      setPreview(null);

      try {
        const res = await productApi.get(product._id);
        if (cancelled) return;

        const detail = res?.data ?? res;
        const analysis = detail?.analysis;
        const currentDescription = stripHtml(
          product.description ||
            product.body_html ||
            product.bodyHtml ||
            product.descriptionHtml ||
            "",
        );

        setPreview({
          currentTitle: product.title || "Current title",
          nextTitle:
            analysis?.optimizedTitle || product.title || "Current title",
          currentDescription:
            currentDescription || "No product description available yet.",
          nextDescription:
            stripHtml(analysis?.optimizedDescription || "") ||
            "A richer, AI-optimized description will be written.",
          keywords: [
            ...(analysis?.bestFor || []),
            ...(analysis?.intentKeywords || []),
          ]
            .filter(Boolean)
            .slice(0, 8),
        });
      } catch {
        if (!cancelled) {
          setPreview({
            currentTitle: product.title || "Current title",
            nextTitle: product.title || "Current title",
            currentDescription:
              stripHtml(
                product.description ||
                  product.body_html ||
                  product.bodyHtml ||
                  product.descriptionHtml ||
                  "",
              ) || "No product description available yet.",
            nextDescription: "Preview unavailable right now.",
            keywords: [],
          });
        }
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    }

    loadPreview();
    return () => {
      cancelled = true;
    };
  }, [product?._id]);

  async function apply() {
    setPhase("applying");
    try {
      await productApi.optimise(product._id);
      setPhase("done");
    } catch (e) {
      setErrMsg(e.message);
      setPhase("error");
    }
  }
  return (
    <Modal title="Apply to Shopify" onClose={onClose}>
      {phase === "confirm" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Push the AI-optimised title, description and tags to your Shopify
              product. Score:{" "}
              <span
                className={`font-bold ${scoreTextClass(product.analysisScore)}`}
              >
                {product.analysisScore}/100
              </span>
              .
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="font-mono-sm text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
              What will update on Shopify
            </p>

            {previewLoading ? (
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Loader2 size={14} className="animate-spin" strokeWidth={1.8} />
                Loading update preview…
              </div>
            ) : preview ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
                  <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
                    Title
                  </p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Current
                      </p>
                      <p className="text-sm text-on-surface">
                        {preview.currentTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Will become
                      </p>
                      <p className="text-sm font-semibold text-on-surface">
                        {preview.nextTitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
                  <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
                    Description
                  </p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Current
                      </p>
                      <p className="text-sm text-on-surface leading-6">
                        {preview.currentDescription}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Will become
                      </p>
                      <p className="text-sm text-on-surface leading-6">
                        {preview.nextDescription}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
                  <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
                    Buyer-intent tags
                  </p>
                  {preview.keywords.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {preview.keywords.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-outline-variant bg-surface-container-highest px-2.5 py-1 text-[11px] text-on-surface-variant"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-on-surface-variant">
                      No extra keywords were generated for this product yet.
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-outline-variant/60 bg-surface/80 p-3">
                  <p className="font-mono-sm text-[10px] font-semibold uppercase text-on-surface-variant">
                    Shopify fields that will change
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Title", "Description", "Tags"].map((field) => (
                      <span
                        key={field}
                        className="rounded-full border border-outline-variant bg-surface-container-highest px-2.5 py-1 text-[11px] text-on-surface-variant"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">
                No preview data is available for this product right now.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={apply}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-[13px] hover:opacity-90 transition-opacity cursor-pointer"
            >
              <WandSparkles size={15} strokeWidth={1.8} />
              Apply to Shopify
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-[13px] border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {phase === "applying" && (
        <div className="flex flex-col items-center py-10 gap-4">
          <Loader2
            size={40}
            className="animate-spin text-primary"
            strokeWidth={1.5}
          />
          <p className="font-mono-sm text-mono-sm text-on-surface-variant">
            Pushing to Shopify…
          </p>
        </div>
      )}
      {phase === "done" && (
        <div className="flex flex-col items-center py-8 gap-4">
          <CheckCircle2
            size={52}
            className="text-green-win"
            strokeWidth={1.5}
          />
          <p className="font-headline-sm text-headline-sm text-green-win">
            Applied!
          </p>
          <button
            onClick={() => {
              onDone?.();
              onClose();
            }}
            className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-opacity text-[13px]"
          >
            Done →
          </button>
        </div>
      )}
      {phase === "error" && (
        <div className="flex flex-col items-center py-8 gap-4">
          <TriangleAlert size={40} className="text-error" strokeWidth={1.5} />
          <p className="text-error text-[13px] font-semibold text-center">
            {errMsg}
          </p>
          <button
            onClick={() => setPhase("confirm")}
            className="px-6 py-2 rounded-xl font-bold border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors text-[13px]"
          >
            Back
          </button>
        </div>
      )}
    </Modal>
  );
}

/* ═══ SIMULATE MODAL ═══════════════════════════════════════════ */
function SimulateModal({ product, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false),
    [results, setResults] = useState([]),
    [err, setErr] = useState(null),
    [ran, setRan] = useState(false);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [promptOptions, setPromptOptions] = useState([]);

  // Pull this product's REAL, already-generated tracked prompts instead of
  // a generic hardcoded set — those aren't grounded in what this specific
  // product actually is, so simulating against them tests nothing useful
  // (and pollutes simulation history with irrelevant records).
  useEffect(() => {
    let cancelled = false;
    setPromptsLoading(true);
    promptApi
      .getProductPrompts(product._id, { limit: 3 })
      .then((res) => {
        if (cancelled) return;
        const prompts = (res?.data?.prompts ?? res?.data ?? [])
          .map((p) => p.prompt)
          .filter(Boolean)
          .slice(0, 3);
        setPromptOptions(prompts);
      })
      .catch(() => {
        if (!cancelled) setPromptOptions([]);
      })
      .finally(() => {
        if (!cancelled) setPromptsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [product._id]);

  async function run() {
    if (promptOptions.length === 0) return;
    setLoading(true);
    setErr(null);
    setResults([]);
    try {
      const settled = await Promise.allSettled(
        promptOptions.map((p) => promptApi.simulate(p, product._id)),
      );
      setResults(
        settled.map((s, i) =>
          s.status === "fulfilled"
            ? {
                id: s.value?.data?._id,
                prompt: promptOptions[i],
                score: s.value?.data?.recommendationScore ?? 0,
                likelihood: s.value?.data?.likelihood ?? "LOW",
                missingSignals: s.value?.data?.missingSignals ?? [],
                recommendations: s.value?.data?.recommendations ?? [],
              }
            : {
                id: null,
                prompt: promptOptions[i],
                score: 0,
                likelihood: "LOW",
                missingSignals: ["Simulation failed"],
                recommendations: [],
              },
        ),
      );
      setRan(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Modal
      title={`Simulate — ${product.title}`}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <p className="font-mono-sm text-mono-sm text-on-surface-variant mb-4">
        Preview how ChatGPT, Perplexity &amp; Gemini would recommend this
        product.
      </p>
      {!ran && !loading && promptsLoading && (
        <div className="flex flex-col items-center py-8 gap-3">
          <Loader2
            size={28}
            className="animate-spin text-primary"
            strokeWidth={1.5}
          />
          <p className="font-mono-sm text-mono-sm text-on-surface-variant">
            Loading this product's tracked prompts…
          </p>
        </div>
      )}
      {!ran && !loading && !promptsLoading && promptOptions.length === 0 && (
        <div className="flex flex-col items-center py-8 gap-3 text-center">
          <TriangleAlert
            size={28}
            className="text-on-surface-variant"
            strokeWidth={1.5}
          />
          <p className="font-mono-sm text-mono-sm text-on-surface-variant max-w-xs">
            This product has no tracked prompts yet — analyse it first so
            RecoMind can generate the buyer prompts to simulate against.
          </p>
        </div>
      )}
      {!ran && !loading && !promptsLoading && promptOptions.length > 0 && (
        <div className="flex flex-col items-center py-6 gap-4 w-full">
          <p className="font-mono-sm text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Prompts to simulate
          </p>
          <div className="flex flex-col gap-2.5 w-full max-w-lg">
            {promptOptions.map((p) => (
              <div
                key={p}
                className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3"
              >
                <p className="text-[14px] font-medium text-on-surface leading-snug">
                  "{p}"
                </p>
              </div>
            ))}
          </div>
          {/* Simulation is temporarily disabled while the simulation flow is being revised.
          <button
            onClick={run}
            className="px-7 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-[13px] hover:opacity-90 transition-opacity"
          >
            Run Simulation
          </button> */}
        </div>
      )}
      {loading && (
        <div className="flex flex-col items-center py-8 gap-3">
          <Loader2
            size={36}
            className="animate-spin text-primary"
            strokeWidth={1.5}
          />
          <p className="font-mono-sm text-mono-sm text-on-surface-variant">
            Running…
          </p>
        </div>
      )}
      {err && (
        <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 font-mono-sm text-mono-sm text-error mb-4">
          ⚠ {err}
        </div>
      )}
      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          {results.map((r) => {
            const wc = winProbColors(
              r.likelihood === "HIGH"
                ? "HIGH"
                : r.likelihood === "MED"
                  ? "MEDIUM"
                  : "LOW",
            );
            const scoreCls =
              r.likelihood === "HIGH"
                ? "text-green-win"
                : r.likelihood === "MED"
                  ? "text-on-tertiary-fixed-variant"
                  : "text-error";
            return (
              <div
                key={r.prompt}
                onClick={() => r.id && navigate(`/app/simulation/${r.id}`)}
                className={`rounded-xl border border-outline-variant bg-surface-container-low p-4 ${
                  r.id
                    ? "cursor-pointer hover:border-outline transition-colors"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-[13px] text-on-surface font-medium">
                    {r.prompt}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[22px] font-black font-mono-sm ${scoreCls}`}
                    >
                      {r.score}
                    </span>
                    <span
                      className={`font-mono-sm text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${wc.text} ${wc.bg} ${wc.border}`}
                    >
                      {r.likelihood}
                    </span>
                  </div>
                </div>
                {r.missingSignals.length > 0 && (
                  <div className="mb-2">
                    <p className="font-mono-sm text-[10px] font-bold uppercase text-error mb-1">
                      Missing
                    </p>
                    {r.missingSignals.slice(0, 2).map((m) => (
                      <div
                        key={m}
                        className="font-mono-sm text-mono-sm text-error flex gap-2 py-0.5"
                      >
                        <span>⚠</span>
                        {m}
                      </div>
                    ))}
                  </div>
                )}
                {r.recommendations.length > 0 && (
                  <div>
                    <p className="font-mono-sm text-[10px] font-bold uppercase text-green-win mb-1">
                      Fix
                    </p>
                    {r.recommendations.slice(0, 2).map((rec) => (
                      <div
                        key={rec}
                        className="font-mono-sm text-mono-sm text-on-surface flex gap-2 py-0.5"
                      >
                        <span className="text-green-win">→</span>
                        {rec}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <button
            onClick={run}
            className="self-start px-5 py-2 rounded-xl font-bold text-[12px] border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Re-run
          </button>
        </div>
      )}
    </Modal>
  );
}

/* ═══ PRODUCT ROW ══════════════════════════════════════════════ */
function ProductRow({
  product,
  onConfirmAnalyse,
  onOptimise,
  onSimulate,
  showRemoveSync,
  onRemoveFromSync,
}) {
  const sc = product.analysisScore,
    hasData = sc != null;
  const detailHref = `/app/products/${product._id}`;

  const navigate = useNavigate();

  const rowContent = (
    <>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <ProductThumb images={product.images} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors truncate max-w-[200px]">
              {product.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {(product.productCategory || product.vendor) && (
                <span className="font-mono-sm text-mono-sm text-on-surface-variant truncate max-w-[160px]">
                  {product.productCategory || product.vendor}
                </span>
              )}
              <StatusBadge
                analysisScore={sc}
                isOptimized={product.isOptimized}
              />
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="px-2 py-0.5 rounded-lg bg-surface-container-highest font-mono-sm text-mono-sm text-on-surface-variant">
          {product.productType || "—"}
        </span>
      </td>
      <td className="px-4 py-3.5">
        {hasData ? (
          <div style={{ width: 140 }}>
            <div className="flex justify-between mb-1.5">
              <span
                className={`font-mono-sm text-mono-sm font-bold ${scoreTextClass(sc)}`}
              >
                {sc}%
              </span>
              <span className="font-mono-sm text-mono-sm text-on-surface-variant">
                {scoreLabel(sc)}
              </span>
            </div>
            <div className="h-[3px] w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${scoreBarClass(sc)}`}
                style={{ width: `${sc}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="font-mono-sm text-mono-sm text-on-surface-variant">
            Not analysed
          </span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex flex-wrap gap-1.5">
          {!product.lastIssues?.length ? (
            <span className="font-mono-sm text-[10px] px-2 py-0.5 rounded border border-outline-variant/50 text-on-surface-variant">
              {hasData ? "None" : "—"}
            </span>
          ) : (
            product.lastIssues.slice(0, 2).map((label, i) => (
              <span
                key={i}
                className="font-mono-sm text-[10px] px-2 py-0.5 rounded flex items-center gap-1 bg-error/8 border border-error/20 text-error"
              >
                <span className="w-1 h-1 rounded-full bg-error animate-pulse shrink-0" />
                {label}
              </span>
            ))
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 text-right">
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {
            hasData && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmAnalyse();
                }}
                className="h-8 inline-flex items-center whitespace-nowrap px-3 rounded-lg font-mono-sm text-[11px] font-semibold border border-outline-variant text-on-surface-variant bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                Re-analyze
              </button>
            )
            // ) : (
            //   <button
            //     onClick={(e) => {
            //       e.stopPropagation();
            //       onSimulate();
            //     }}
            //     className="h-8 inline-flex items-center whitespace-nowrap px-3 rounded-lg font-mono-sm text-[11px] font-semibold border border-outline-variant text-on-surface-variant bg-surface-container hover:text-on-surface transition-colors  cursor-pointer"
            //   >
            //     Simulate
            //   </button>
            // )
          }
          <ActionButton
            product={product}
            onConfirmAnalyse={onConfirmAnalyse}
            onOptimise={onOptimise}
          />
          {hasData && (
            <Link
              to={detailHref}
              onClick={(e) => e.stopPropagation()}
              className="h-8 inline-flex items-center whitespace-nowrap px-3 rounded-lg font-mono-sm text-[11px] font-semibold border border-outline-variant text-on-surface-variant bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            >
              View
            </Link>
          )}
          {showRemoveSync && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromSync();
              }}
              title="Remove from sync"
              aria-label="Remove from sync"
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors border-l border-outline-variant/60 ml-1 pl-2  cursor-pointer"
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </td>
    </>
  );

  if (hasData) {
    return (
      <tr
        className="hover:bg-surface-container-low/60 transition-colors group border-b border-outline-variant last:border-0 cursor-pointer"
        onClick={(e) => {
          if (e.target.closest("button") || e.target.closest("a")) return;
          navigate(detailHref);
        }}
      >
        {rowContent}
      </tr>
    );
  }
  return (
    <tr
      onClick={onConfirmAnalyse}
      className="hover:bg-surface-container-low/60 transition-colors group cursor-pointer border-b border-outline-variant last:border-0"
    >
      {rowContent}
    </tr>
  );
}

/* ═══ STAT TILE ════════════════════════════════════════════════ */
function StatTile({
  icon: Ico,
  label,
  value,
  loading,
  accentLeft = "",
  valueClass = "",
}) {
  return (
    <Card className={`flex items-center gap-4 px-5 py-4 ${accentLeft}`}>
      <Ico
        size={20}
        className={`shrink-0 ${valueClass || "text-on-surface-variant"}`}
        strokeWidth={1.8}
      />
      <div>
        <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-wide">
          {label}
        </p>
        <p
          className={`font-display-lg text-[26px] font-bold leading-none mt-0.5 ${valueClass || "text-on-surface"}`}
        >
          {loading ? "—" : (value ?? "—")}
        </p>
      </div>
    </Card>
  );
}

export const loader = async () => null;

/* ═══ PRODUCTS PAGE ════════════════════════════════════════════ */
export default function Products() {
  const { token } = useAuth();
  const decoded = token ? jwtDecode(token) : null;
  const storePlan = decoded?.storePlan?.toLowerCase();
  const canManageSyncedProducts = storePlan && storePlan !== "starter";
  const {
    startBulkAnalysis,
    activeBatch,
    showToast: trackerToast,
  } = useAnalysisTracker();

  const [page, setPage] = useState(1),
    [sort, setSort] = useState("score_asc");
  const [statusFilter, setStatusFilter] = useState("all"),
    [query, setQuery] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null),
    [analyseTarget, setAnalyseTarget] = useState(null);
  const [optimiseTarget, setOptimiseTarget] = useState(null),
    [simulateTarget, setSimulateTarget] = useState(null);
  const [toast, setToast] = useState(null),
    [syncLoading, setSyncLoading] = useState(false),
    [bulkStarting, setBulkStarting] = useState(false);

  const dq = useDebounced(query, 220);
  const params = { page, sort, limit: 10 };
  if (statusFilter === "optimized") params.optimized = "true";
  if (statusFilter === "unoptimized") params.optimized = "false";
  if (dq.trim()) params.search = dq.trim();

  // A new search term invalidates whatever page you were on — landing on
  // page 3 of a search that only has 1 page of results shows an empty list.
  useEffect(() => {
    setPage(1);
  }, [dq]);

  const { data, loading, error, refetch } = useApi(
    token ? () => productApi.list(params) : null,
    [token, page, sort, statusFilter, dq],
  );
  const { data: countAll } = useApi(
    token ? () => productApi.list({ page: 1, limit: 20 }) : null,
    [token],
  );

  const { data: countOpt } = useApi(
    token
      ? () => productApi.list({ page: 1, limit: 1, optimized: "true" })
      : null,
    [token],
  );
  const { data: countUnopt } = useApi(
    token
      ? () => productApi.list({ page: 1, limit: 20, optimized: "false" })
      : null,
    [token],
  );

  // Refetch the list whenever products get synced (ProductSyncModal) or an
  // analysis (single or bulk) finishes anywhere — including if it finished
  // while the user was on a different page and just navigated back here.
  useEffect(() => {
    function onProductsSynced() {
      refetch();
    }
    function onAnalysisUpdated() {
      refetch();
    }
    window.addEventListener("recomind:products-synced", onProductsSynced);
    window.addEventListener("recomind:analysis-updated", onAnalysisUpdated);
    return () => {
      window.removeEventListener("recomind:products-synced", onProductsSynced);
      window.removeEventListener(
        "recomind:analysis-updated",
        onAnalysisUpdated,
      );
    };
  }, [refetch]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }
  function handleSync() {
    // Full-catalog sync is capped-plan-restricted server-side now — open
    // the picker (mounted globally via ProductSyncGate) instead of hitting
    // productApi.sync() directly.
    window.dispatchEvent(new Event("recomind:open-sync-picker"));
  }
  const [removeSyncTarget, setRemoveSyncTarget] = useState(null);
  const [removingSync, setRemovingSync] = useState(false);

  function handleRemoveFromSync(product) {
    setRemoveSyncTarget(product);
  }

  async function confirmRemoveFromSync() {
    if (!removeSyncTarget) return;
    setRemovingSync(true);
    try {
      const r = await productApi.removeFromSync(removeSyncTarget._id);
      showToast(r.message || "Product removed from sync");
      refetch();
      setRemoveSyncTarget(null);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setRemovingSync(false);
    }
  }
  async function handleBulkAnalyse() {
    if (activeBatch) return; // a batch is already running — button is disabled anyway
    setBulkStarting(true);
    try {
      await startBulkAnalysis();
      // The tracker's own toast covers "started"/"no products to analyse";
      // no local toast needed here, and completion fires its own toast
      // automatically once every job in the batch is done — from any page.
    } catch (e) {
      trackerToast(e.message, "error");
    } finally {
      setBulkStarting(false);
    }
  }

  const products = data?.data ?? (Array.isArray(data) ? data : []);
  const pagination = data?.pagination;
  const totalCount = countAll?.pagination?.total ?? "—";
  const optCount = countOpt?.pagination?.total ?? "—";
  const unoptCount = countUnopt?.pagination?.total ?? "—";
  const avgScore = data?.avgScore,
    critCount = data?.criticalCount;
  const thisTabTotal = pagination?.total ?? products.length;

  const tabItems = [
    { key: "all", label: "All Products", badge: totalCount },
    { key: "optimized", label: "Optimized", badge: optCount },
    { key: "unoptimized", label: "Unoptimized", badge: unoptCount },
  ];

  return (
    <div className="space-y-4">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <PageHeader
        title="Product Inventory"
        subtitle="Manage and optimize AI visibility across your commerce ecosystem."
        actions={
          <>
            <button
              onClick={handleSync}
              disabled={syncLoading}
              className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-on-surface hover:brightness-95 transition-all disabled:opacity-50 font-label-md text-label-md  cursor-pointer"
            >
              {syncLoading ? (
                <Loader2
                  size={16}
                  className="animate-spin shrink-0"
                  strokeWidth={1.8}
                />
              ) : (
                <RotateCcw size={16} strokeWidth={1.8} className="shrink-0" />
              )}
              Sync Shopify
            </button>
            <BulkAnalyseButton
              onClick={handleBulkAnalyse}
              starting={bulkStarting}
              variant="compact"
            />
          </>
        }
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-4 gap-4">
        <StatTile
          icon={Package}
          label="Total SKUs"
          value={totalCount}
          loading={loading}
        />
        <StatTile
          icon={CheckCircle2}
          label="Avg AI Score"
          value={avgScore != null ? `${avgScore}%` : "—"}
          loading={loading}
        />
        <StatTile
          icon={TriangleAlert}
          label="Critical Issues"
          value={critCount}
          loading={loading}
          accentLeft="border-l-2 border-l-error"
          valueClass="text-error"
        />
        <StatTile
          icon={Zap}
          label="Optimised"
          value={optCount}
          loading={loading}
          accentLeft="border-l-2 border-l-[#00e29e]"
          valueClass="text-green-win"
        />
      </div>

      {/* Tabs + search */}
      <div className="flex items-center justify-between gap-1 ">
        <PillTabs
          items={tabItems}
          value={statusFilter}
          onChange={(k) => {
            setStatusFilter(k);
            setPage(1);
          }}
        />
        <div className="flex items-center gap-1">
          <div className="relative ">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant  cursor-pointer"
              strokeWidth={1.8}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="pl-8 py-2 rounded-xl w-70 font-mono-sm text-mono-sm outline-none  bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:border-outline transition-colors"
            />
          </div>
          <div className="flex items-center gap-0.5 font-mono-sm text-mono-sm glass-card rounded-xl px-2 py-1">
            <ArrowUpDown
              size={14}
              strokeWidth={1.8}
              className="text-on-surface-variant "
            />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-transparent py-1 max-w-30 font-mono-sm text-mono-sm font-semibold text-on-surface cursor-pointer outline-none"
            >
              <option value="score_asc">Low to High</option>
              <option value="score_desc">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low">
                {[
                  "Product",
                  "Category",
                  "AI Readiness",
                  "Issues",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 font-mono-sm text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.12em] whitespace-nowrap ${i === 4 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      {/* <Loader2
                        size={28}
                        className="animate-spin text-on-surface-variant"
                        strokeWidth={1.5}
                      />
                      <span className="font-mono-sm text-mono-sm text-on-surface-variant">
                        Loading products…
                      </span> */}
                      <AiSpinner label="Loading Products" />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <TriangleAlert
                        size={40}
                        className="text-error"
                        strokeWidth={1.5}
                      />
                      <span className="font-mono-sm text-mono-sm text-error">
                        {error}
                      </span>
                      <button
                        onClick={refetch}
                        className="px-5 py-2 rounded-xl font-bold border border-error/40 bg-error/10 text-error font-mono-sm text-mono-sm"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Package
                        size={44}
                        className="text-on-surface-variant"
                        strokeWidth={1.5}
                      />
                      <p className="font-mono-sm text-mono-sm text-on-surface-variant">
                        {dq
                          ? `No products match "${dq}"`
                          : "No products yet. Sync your Shopify store."}
                      </p>
                      {!dq && (
                        <button
                          onClick={handleSync}
                          disabled={syncLoading}
                          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 disabled:opacity-50 font-mono-sm text-mono-sm"
                        >
                          {syncLoading ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                              strokeWidth={1.8}
                            />
                          ) : (
                            <RotateCcw size={14} strokeWidth={1.8} />
                          )}
                          Sync Now
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <ProductRow
                    key={p._id}
                    product={p}
                    onConfirmAnalyse={() => setConfirmTarget(p)}
                    onOptimise={() => setOptimiseTarget(p)}
                    onSimulate={() => setSimulateTarget(p)}
                    showRemoveSync={canManageSyncedProducts}
                    onRemoveFromSync={() => handleRemoveFromSync(p)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        <Divider />
        <div className="px-5 py-3 flex items-center justify-between">
          <p className="font-mono-sm text-mono-sm text-on-surface-variant">
            Showing{" "}
            <span className="font-bold text-on-surface">
              {products.length === 0
                ? 0
                : `${(page - 1) * 10 + 1}–${Math.min(page * 10, thisTabTotal)}`}
            </span>{" "}
            of <span className="font-bold text-on-surface">{thisTabTotal}</span>
          </p>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              onChange={setPage}
            />
          )}
        </div>
      </Card>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <BarChart2 size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Brain
                size={18}
                className="text-secondary shrink-0"
                strokeWidth={1.8}
              />
              <Eyebrow>Intelligence</Eyebrow>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              Global Visibility Intelligence
            </h3>
            <p className="text-on-surface-variant mb-5 max-w-lg">
              {critCount > 0 ? (
                <>
                  <span className="text-error font-bold">
                    {critCount} products
                  </span>{" "}
                  are critically under-optimised. Run Bulk Analysis to generate
                  interpretations and smart prompts.
                </>
              ) : (
                "Your catalog is in good shape. Run Bulk Analysis to refresh AI scores and regenerate smart prompts."
              )}
            </p>
            <div className="flex gap-3">
              <BulkAnalyseButton
                onClick={handleBulkAnalyse}
                starting={bulkStarting}
                variant="cta"
              />
              <Link
                to="/app/reports"
                className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container transition-colors font-label-md text-label-md cursor-pointer"
              >
                <Download size={15} strokeWidth={1.8} />
                Export Report
              </Link>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-primary">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
            Recent Optimizations
          </h3>
          {products.filter((p) => p.isOptimized).length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle2
                size={32}
                className="text-on-surface-variant"
                strokeWidth={1.5}
              />
              <p className="font-mono-sm text-mono-sm text-on-surface-variant text-center">
                No products optimised yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {products
                .filter((p) => p.isOptimized)
                .slice(0, 4)
                .map((p) => (
                  <Link
                    key={p._id}
                    to={`/app/products/${p._id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono-sm text-[12px] font-bold text-on-surface truncate">
                        {p.title}
                      </p>
                      <p className="font-mono-sm text-mono-sm text-on-surface-variant">
                        Score:{" "}
                        {p.analysisScore != null ? `${p.analysisScore}%` : "—"}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-on-surface-variant"
                      strokeWidth={2}
                    />
                  </Link>
                ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      {confirmTarget && !analyseTarget && (
        <ConfirmAnalyseModal
          product={confirmTarget}
          onClose={() => setConfirmTarget(null)}
          onConfirm={() => {
            setAnalyseTarget(confirmTarget);
            setConfirmTarget(null);
          }}
        />
      )}
      {analyseTarget && (
        <AnalyseModal
          product={analyseTarget}
          onClose={() => setAnalyseTarget(null)}
          onDone={() => {
            setAnalyseTarget(null);
            refetch();
          }}
        />
      )}
      {optimiseTarget && (
        <OptimiseModal
          product={optimiseTarget}
          onClose={() => setOptimiseTarget(null)}
          onDone={() => refetch()}
        />
      )}
      {simulateTarget && (
        <SimulateModal
          product={simulateTarget}
          onClose={() => setSimulateTarget(null)}
        />
      )}
      {removeSyncTarget && (
        <Modal
          title="Remove from sync"
          onClose={() => !removingSync && setRemoveSyncTarget(null)}
          maxWidth="max-w-md"
        >
          <p className="font-mono-sm text-mono-sm text-on-surface leading-relaxed">
            Remove <span className="font-bold">"{removeSyncTarget.title}"</span>{" "}
            from sync?
          </p>
          <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-2 leading-relaxed">
            Its analysis history is kept, and this frees a slot to add another
            product.
          </p>
          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              onClick={() => setRemoveSyncTarget(null)}
              disabled={removingSync}
              className="px-4 py-2 rounded-xl font-mono-sm text-mono-sm font-semibold border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmRemoveFromSync}
              disabled={removingSync}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono-sm text-mono-sm font-bold bg-error text-on-error hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {removingSync && (
                <Loader2 size={14} className="animate-spin" strokeWidth={2} />
              )}
              Remove
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
