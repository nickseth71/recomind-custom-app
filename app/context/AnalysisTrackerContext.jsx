import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { productApi } from "../lib/api";

const STORAGE_KEY = "recomind_analysis_tracker_v1";
const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 180_000; // per job — matches worker's realistic ceiling

const AnalysisTrackerContext = createContext(null);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { jobs: {}, batches: {} };
    return JSON.parse(raw);
  } catch {
    return { jobs: {}, batches: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full/unavailable — tracking still works in-memory for this tab */
  }
}

const TERMINAL_STATUSES = ["completed", "failed", "not_found"];

export function AnalysisTrackerProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [toast, setToast] = useState(null);
  const pollRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  function showToast(msg, type = "success") {
    setToast({ msg, type, id: Date.now() });
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }, []);

  // ── Single-job polling driver ──────────────────────────────────────
  const pollOnce = useCallback(async () => {
    const { jobs, batches } = stateRef.current;
    const activeJobIds = Object.keys(jobs).filter(
      (id) => !TERMINAL_STATUSES.includes(jobs[id].status),
    );
    if (activeJobIds.length === 0) return;

    const results = await Promise.all(
      activeJobIds.map(async (jobId) => {
        try {
          const res = await productApi.jobStatus(jobId);
          return { jobId, data: res.data };
        } catch {
          return { jobId, data: null };
        }
      }),
    );

    updateState((prev) => {
      const nextJobs = { ...prev.jobs };
      const nextBatches = { ...prev.batches };
      const finishedProductIds = [];
      const batchesJustCompleted = [];

      for (const { jobId, data } of results) {
        const job = nextJobs[jobId];
        if (!job) continue;

        if (!data) {
          // transient poll failure — leave job as-is, try again next tick
          continue;
        }

        const now = Date.now();
        const timedOut = now - job.startedAt > POLL_TIMEOUT_MS;

        if (data.status === "completed") {
          nextJobs[jobId] = {
            ...job,
            status: "completed",
            pollCount: job.pollCount + 1,
          };
          finishedProductIds.push(job.productId);
        } else if (
          data.status === "failed" ||
          data.status === "not_found" ||
          timedOut
        ) {
          nextJobs[jobId] = {
            ...job,
            status: "failed",
            failReason:
              data.failReason || (timedOut ? "Timed out" : "Analysis failed"),
            pollCount: job.pollCount + 1,
          };
        } else {
          nextJobs[jobId] = {
            ...job,
            status: data.status,
            pollCount: job.pollCount + 1,
          };
        }

        // Roll the result into this job's batch, if it belongs to one
        const batchId = job.batchId;
        if (batchId && nextBatches[batchId]) {
          const b = nextBatches[batchId];
          const jobNowTerminal = TERMINAL_STATUSES.includes(
            nextJobs[jobId].status,
          );
          const wasTerminal = TERMINAL_STATUSES.includes(job.status);
          if (jobNowTerminal && !wasTerminal) {
            const succeeded = nextJobs[jobId].status === "completed";
            const updatedBatch = {
              ...b,
              completed: b.completed + (succeeded ? 1 : 0),
              failed: b.failed + (succeeded ? 0 : 1),
            };
            nextBatches[batchId] = updatedBatch;
            if (
              updatedBatch.completed + updatedBatch.failed >=
              updatedBatch.total
            ) {
              nextBatches[batchId] = { ...updatedBatch, status: "done" };
              batchesJustCompleted.push(nextBatches[batchId]);
            }
          }
        }
      }

      // Fire toasts for individually-tracked single-product jobs (not part of a batch)
      for (const { jobId, data } of results) {
        const job = jobs[jobId]; // previous status, to detect the transition
        const updated = nextJobs[jobId];
        if (!job || !updated || job.batchId) continue;
        const wasTerminal = TERMINAL_STATUSES.includes(job.status);
        const isTerminal = TERMINAL_STATUSES.includes(updated.status);
        if (!wasTerminal && isTerminal) {
          if (updated.status === "completed") {
            showToast(`Analysis complete: ${updated.productTitle}`, "success");
          } else {
            showToast(
              `Analysis failed: ${updated.productTitle}${updated.failReason ? " — " + updated.failReason : ""}`,
              "error",
            );
          }
        }
      }

      for (const batch of batchesJustCompleted) {
        showToast(
          batch.failed > 0
            ? `Bulk analysis finished: ${batch.completed}/${batch.total} succeeded`
            : `Bulk analysis complete: ${batch.total} product${batch.total === 1 ? "" : "s"} analysed`,
          batch.failed > 0 && batch.completed === 0 ? "error" : "success",
        );
      }

      if (finishedProductIds.length > 0 || batchesJustCompleted.length > 0) {
        window.dispatchEvent(
          new CustomEvent("recomind:analysis-updated", {
            detail: { productIds: finishedProductIds },
          }),
        );
      }

      return { jobs: nextJobs, batches: nextBatches };
    });
  }, [updateState]);

  useEffect(() => {
    pollRef.current = setInterval(pollOnce, POLL_INTERVAL_MS);
    // Also poll once immediately on mount, in case jobs were left running
    // from before a full page reload.
    pollOnce();
    return () => clearInterval(pollRef.current);
  }, [pollOnce]);

  // ── Public API ────────────────────────────────────────────────────

  /** Start (or attach to) a single-product analysis job. */
  const startSingleAnalysis = useCallback(
    async (product) => {
      const res = await productApi.analyse(product._id);
      const jobId = res.data?.jobId;

      if (!jobId && res.data?.usingCached) {
        showToast(`Analysis complete: ${product.title}`, "success");
        window.dispatchEvent(
          new CustomEvent("recomind:analysis-updated", {
            detail: { productIds: [product._id] },
          }),
        );
        return { usingCached: true, analysis: res.data.analysis };
      }
      if (!jobId) throw new Error("No job ID returned");

      updateState((prev) => ({
        ...prev,
        jobs: {
          ...prev.jobs,
          [jobId]: {
            jobId,
            productId: product._id,
            productTitle: product.title,
            status: "queuing",
            pollCount: 0,
            startedAt: Date.now(),
            batchId: null,
          },
        },
      }));
      return { jobId };
    },
    [updateState],
  );

  /** Start a bulk analysis batch across all eligible products. */
  const startBulkAnalysis = useCallback(async () => {
    const res = await productApi.analyseBulk();
    const jobIds = res.data?.jobIds || [];

    if (jobIds.length === 0) {
      showToast(res.message || "No products to analyse", "success");
      return res;
    }

    const batchId = `batch-${Date.now()}`;
    updateState((prev) => {
      const nextJobs = { ...prev.jobs };
      for (const jobId of jobIds) {
        nextJobs[jobId] = {
          jobId,
          productId: null, // filled in once the first poll returns job.data.productId
          productTitle: null,
          status: "queuing",
          pollCount: 0,
          startedAt: Date.now(),
          batchId,
        };
      }
      return {
        jobs: nextJobs,
        batches: {
          ...prev.batches,
          [batchId]: {
            batchId,
            total: jobIds.length,
            completed: 0,
            failed: 0,
            status: "running",
            startedAt: Date.now(),
          },
        },
      };
    });
    return res;
  }, [updateState]);

  /** Any non-terminal job currently tracked for this product (single or bulk-sourced). */
  const getProductJob = useCallback(
    (productId) => {
      return Object.values(state.jobs).find(
        (j) =>
          j.productId === productId && !TERMINAL_STATUSES.includes(j.status),
      );
    },
    [state.jobs],
  );

  /** The currently running bulk batch, if any (there's realistically only ever one at a time). */
  const activeBatch = Object.values(state.batches).find(
    (b) => b.status === "running",
  );

  /** Clear a finished/failed job from tracking (e.g. after the user acknowledges an error). */
  const dismissJob = useCallback(
    (jobId) => {
      updateState((prev) => {
        const nextJobs = { ...prev.jobs };
        delete nextJobs[jobId];
        return { ...prev, jobs: nextJobs };
      });
    },
    [updateState],
  );

  // Periodically prune old terminal jobs/batches so localStorage doesn't grow forever
  useEffect(() => {
    const cleanup = setInterval(() => {
      updateState((prev) => {
        const cutoff = Date.now() - 10 * 60 * 1000; // 10 minutes
        const nextJobs = Object.fromEntries(
          Object.entries(prev.jobs).filter(
            ([, j]) =>
              !TERMINAL_STATUSES.includes(j.status) || j.startedAt > cutoff,
          ),
        );
        const nextBatches = Object.fromEntries(
          Object.entries(prev.batches).filter(
            ([, b]) => b.status !== "done" || b.startedAt > cutoff,
          ),
        );
        return { jobs: nextJobs, batches: nextBatches };
      });
    }, 60_000);
    return () => clearInterval(cleanup);
  }, [updateState]);

  return (
    <AnalysisTrackerContext.Provider
      value={{
        jobs: state.jobs,
        startSingleAnalysis,
        startBulkAnalysis,
        getProductJob,
        activeBatch,
        dismissJob,
        toast,
        showToast,
      }}
    >
      {children}
    </AnalysisTrackerContext.Provider>
  );
}

export function useAnalysisTracker() {
  const ctx = useContext(AnalysisTrackerContext);
  if (!ctx) {
    throw new Error(
      "useAnalysisTracker must be used within AnalysisTrackerProvider",
    );
  }
  return ctx;
}
