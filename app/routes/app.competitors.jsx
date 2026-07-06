import { useEffect, useMemo, useState, useRef } from "react";
import { useApi } from "../hooks/useApi";
import { productApi } from "../lib/api";

// ─── Value renderer ───────────────────────────────────────────
function CellValue({ value, isYou, isScoreRow, isReviewRow }) {
  const v =
    value === null || value === undefined || value === "" ? "—" : String(value);

  // Tick / cross
  if (v === "✓" || v === "true" || v.toLowerCase() === "yes") {
    return (
      <span
        className={`text-lg font-bold ${isYou ? "text-[#00e29e]" : "text-[#00e29e]"}`}
      >
        ✓
      </span>
    );
  }
  if (v === "✗" || v === "false" || v.toLowerCase() === "no") {
    return <span className="text-lg font-bold text-error">✗</span>;
  }
  if (v.toLowerCase() === "partial") {
    return (
      <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#e9ba00]/15 text-[#7b5800] border border-[#e9ba00]/30">
        Partial
      </span>
    );
  }

  // AI Visibility Score row — show as X/100 badge
  if (isScoreRow) {
    const num = parseInt(v);
    const color = num >= 70 ? "#00e29e" : num >= 40 ? "#e9ba00" : "#ba1a1a";
    return (
      <span className="font-mono-sm font-black text-[15px]" style={{ color }}>
        {v}/100
      </span>
    );
  }

  // Review counts — format with comma
  if (isReviewRow && !isNaN(v.replace(/,/g, ""))) {
    const num = parseInt(v.replace(/,/g, ""));
    return (
      <span className="font-mono-sm font-semibold text-on-surface">
        {num.toLocaleString()}
      </span>
    );
  }

  // Default
  return <span className="text-sm text-on-surface-variant">{v}</span>;
}

// ─── Main Component ───────────────────────────────────────────
const Competitors = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("recomind_token")
      : null;

  const [selectedProductId, setSelectedProductId] = useState("");
  const [productPage, setProductPage] = useState(1);
  const [productSearch, setProductSearch] = useState("");
  const [pageInput, setPageInput] = useState(1);

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useApi(
    token
      ? () =>
          productApi.list({
            page: productPage,
            limit: 20,
            search: productSearch.trim(),
          })
      : null,
    [token, productPage, productSearch],
  );

  const products = useMemo(() => {
    const list = productsData?.data ?? productsData?.products ?? [];
    return Array.isArray(list) ? list : [];
  }, [productsData]);
  const pagination = productsData?.pagination ?? null;

  useEffect(() => {
    setProductPage(1);
  }, [productSearch]);

  useEffect(() => {
    setPageInput(productPage);
  }, [productPage]);

  useEffect(() => {
    if (!products.length) {
      if (selectedProductId) {
        setSelectedProductId("");
      }
      return;
    }

    if (
      !selectedProductId ||
      !products.some((product) => product._id === selectedProductId)
    ) {
      setSelectedProductId(products[0]._id);
    }
  }, [products, selectedProductId]);

  const {
    data: benchmarkResponse,
    loading: benchmarkLoading,
    error: benchmarkError,
  } = useApi(
    token && selectedProductId
      ? () => productApi.getCompetitors(selectedProductId)
      : null,
    [token, selectedProductId],
  );

  const benchmark = benchmarkResponse?.data?.competitorBenchmark;
  const enabled = benchmarkResponse?.data?.enabled ?? false;
  const competitorCount = benchmarkResponse?.data?.competitorCount ?? 0;
  const rows = benchmark?.competitors ?? [];
  // columns[0] = "Feature / Signal", columns[1] = "You", columns[2..] = competitors
  const columns = benchmark?.columns ?? [];
  const selectedProduct =
    products.find((p) => p._id === selectedProductId) || products[0] || null;

  // Column headers: skip index 0 (Feature / Signal), keep rest
  const headerCols = columns.slice(1); // ["You", "Tiffany...", "Cartier...", ...]
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-headline-lg text-on-surface text-headline-lg">
          Competitor Analysis
        </h1>
        <p className="text-on-surface-variant mt-1 text-body-md">
          Compare your product's AI visibility against top competitors.
        </p>
      </div>

      {/* Product selector bar */}
      <div
        className="rounded-xl px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between "
        style={{
          background: "var(--color-surface-container-low)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div className="shrink-0">
          <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-on-surface-variant">
            Benchmark Source
          </p>

          <h3 className="mt-1 text-base font-bold text-on-surface">
            Compare with
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* <label
            htmlFor="product-select"
            className="text-sm text-on-surface-variant whitespace-nowrap"
          >
            Compare with
          </label> */}
          {/* <select
            id="product-select"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            disabled={productsLoading || !products.length}
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none cursor-pointer  disabled:opacity-50"
            style={{
              background: "var(--color-surface-container-lowest)",
              border: "1px solid var(--color-outline-variant)",
              color: "var(--color-on-surface)",
            }}
          >
            {productsLoading && <option value="" className="rounded-xl bg-amber-100" >Loading...</option>}
            {!productsLoading && !products.length && (
              <option value="">No products</option>
            )}
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select> */}
          <div className="relative w-[450px]" ref={dropdownRef}>
            {/* Button */}

            {/* <button
    type="button"
    disabled={productsLoading || !products.length}
    onClick={() => setIsOpen((prev) => !prev)}
    className="w-full flex items-center justify-between rounded-2xl px-5 py-3 text-left font-semibold transition-all duration-300 disabled:opacity-50"
    style={{
      background: "rgba(255,248,240,0.65)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(28,36,84,.15)",
      color: "var(--color-on-surface)",
      boxShadow: "0 10px 25px rgba(28,36,84,.08)",
    }}
  >
    <span className="truncate">
      {selectedProduct?.title || "Select a product"}
    </span>

    <svg
      className={`h-5 w-5 transition-transform ${
        isOpen ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button> */}
            <button
              type="button"
              disabled={productsLoading || !products.length}
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3 rounded-2xl px-5 py-3 text-left disabled:opacity-50 transition-all duration-300"
              style={{
                background: "rgba(255,248,240,0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(28,36,84,.15)",
                color: "var(--color-on-surface)",
                boxShadow: "0 10px 25px rgba(28,36,84,.08)",
              }}
            >
              {/* <span className="flex-1 min-w-0 truncate text-sm font-semibold">
    {selectedProduct?.title || "Select a product"}
  </span> */}
              <span
                className="flex-1 min-w-0 truncate text-sm font-semibold"
                title={selectedProduct?.title}
              >
                {selectedProduct?.title || "Select a product"}
              </span>

              <svg
                className={`h-4 w-4 shrink-0 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown */}

            {isOpen && (
              <div
                className="absolute left-0 mt-2 w-full rounded-2xl overflow-hidden z-50"
                style={{
                  background: "rgba(255,248,240,.82)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(28,36,84,.12)",
                  boxShadow: "0 20px 40px rgba(28,36,84,.18)",
                }}
              >
                <div className="border-b border-[rgba(28,36,84,0.08)] px-3 py-2">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products"
                    className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                    style={{
                      background: "rgba(255,248,240,.95)",
                      border: "1px solid rgba(28,36,84,.12)",
                      color: "var(--color-on-surface)",
                    }}
                  />
                </div>

                {productsLoading && (
                  <div className="px-5 py-3 text-sm">Loading...</div>
                )}

                {!productsLoading && !products.length && (
                  <div className="px-5 py-3 text-sm">No products found</div>
                )}

                {!productsLoading &&
                  products.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => {
                        setSelectedProductId(p._id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 transition-all duration-200
              ${
                selectedProductId === p._id
                  ? "bg-[#1C2454] text-white"
                  : "text-on-surface hover:bg-[rgba(28,36,84,0.08)]"
              }
            `}
                      onMouseEnter={(e) => {
                        if (selectedProductId !== p._id) {
                          e.currentTarget.style.background = "#F7EFD9";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedProductId !== p._id) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      {p.title}
                    </button>
                  ))}

                {pagination && (
                  <div className="flex items-center justify-between gap-3 border-t border-[rgba(28,36,84,0.08)] px-3 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setProductPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={productPage <= 1}
                      className="rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                      style={{
                        background: "rgba(28,36,84,0.08)",
                        color: "var(--color-on-surface)",
                      }}
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={pagination.totalPages || 1}
                        value={pageInput}
                        onChange={(e) => setPageInput(Number(e.target.value))}
                        className="w-14 rounded-lg border border-[rgba(28,36,84,0.12)] px-2 py-1 text-center text-sm outline-none"
                        style={{ background: "rgba(255,248,240,.95)" }}
                      />
                      <span className="text-xs font-semibold text-on-surface-variant">
                        / {pagination.totalPages || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextPage = Math.min(
                            Math.max(1, Number(pageInput) || 1),
                            pagination.totalPages || 1,
                          );
                          setProductPage(nextPage);
                        }}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold"
                        style={{
                          background: "var(--color-primary)",
                          color: "var(--color-on-primary)",
                        }}
                      >
                        Go
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setProductPage((prev) => prev + 1)}
                      disabled={productPage >= (pagination.totalPages || 1)}
                      className="rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                      style={{
                        background: "rgba(28,36,84,0.08)",
                        color: "var(--color-on-surface)",
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Competitor count badge */}
          {enabled && competitorCount > 0 && (
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap"
              style={{
                background: "var(--color-primary-container)",
                color: "var(--color-on-primary-container)",
                border: "1px solid var(--color-primary-fixed-dim)",
              }}
            >
              Top {competitorCount} Competitors
            </span>
          )}
        </div>
      </div>

      {/* Error states */}
      {productsError && (
        <div
          className="rounded-xl px-4 py-3 text-sm font-semibold"
          style={{
            background: "var(--color-error-container)",
            color: "var(--color-error)",
            border: "1px solid var(--color-error)/30",
          }}
        >
          {productsError}
        </div>
      )}

      {/* Loading skeleton */}
      {benchmarkLoading && (
        <div
          className="rounded-xl px-5 py-10 text-center text-sm text-on-surface-variant animate-pulse"
          style={{
            background: "var(--color-surface-container-low)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          Loading competitor benchmark…
        </div>
      )}

      {/* Not enabled */}
      {!benchmarkLoading && !benchmarkError && !enabled && (
        <div
          className="rounded-xl px-6 py-8 text-center"
          style={{
            background: "var(--color-surface-container-low)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          <p className="font-semibold text-on-surface mb-2">
            Competitor benchmarks are not available on this plan.
          </p>
          <p className="text-sm text-on-surface-variant">
            Upgrade to Growth or Pro to unlock competitor comparisons.
          </p>
        </div>
      )}

      {/* No benchmark yet */}
      {!benchmarkLoading && !benchmarkError && enabled && !benchmark && (
        <div
          className="rounded-xl px-6 py-8 text-center"
          style={{
            background: "var(--color-surface-container-low)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          <p className="font-semibold text-on-surface mb-2">
            No benchmark data yet.
          </p>
          <p className="text-sm text-on-surface-variant">
            Run a product analysis first so we can generate competitor
            benchmarks.
          </p>
        </div>
      )}

      {/* ── THE TABLE ── */}
      {!benchmarkLoading && !benchmarkError && enabled && benchmark && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--color-outline-variant)" }}
        >
          {/* Table header */}
          <div
            className="grid text-sm font-bold"
            style={{
              // 1 feature col + N competitor cols
              gridTemplateColumns: `minmax(180px, 1.5fr) repeat(${headerCols.length}, minmax(120px, 1fr))`,
              background: "var(--color-primary-container)",
              borderBottom: "1px solid var(--color-outline-variant)",
            }}
          >
            {/* Feature / Signal header */}
            <div
              className="px-5 py-3.5 text-[12px] uppercase tracking-widest font-semibold"
              style={{
                color: "var(--color-on-primary-container)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Feature / Signal
            </div>
            {/* Competitor column headers */}
            {headerCols.map((col, i) => {
              const isYou = col === "You" || i === 0;
              return (
                <div
                  key={col}
                  className="px-4 py-3.5 text-center truncate"
                  style={{
                    color: isYou
                      ? "#00e29e"
                      : "var(--color-on-primary-container)",
                    fontWeight: isYou ? 800 : 600,
                    borderRight:
                      i < headerCols.length - 1
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "none",
                    fontSize: 13,
                  }}
                >
                  {col}
                </div>
              );
            })}
          </div>

          {/* Table rows */}
          <div style={{ background: "var(--color-surface)" }}>
            {rows.map((row, rowIdx) => {
              const featureName = row.productName || `Row ${rowIdx + 1}`;
              const values = row.attributes?.values ?? [];
              const isScoreRow = featureName.toLowerCase().includes("score");
              const isReviewRow = featureName.toLowerCase().includes("review");
              const isLast = rowIdx === rows.length - 1;
              const isEven = rowIdx % 2 === 0;

              return (
                <div
                  key={`${featureName}-${rowIdx}`}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: `minmax(180px, 1.5fr) repeat(${headerCols.length}, minmax(120px, 1fr))`,
                    borderBottom: isLast
                      ? "none"
                      : "1px solid var(--color-outline-variant)",
                    background: isEven
                      ? "var(--color-surface)"
                      : "var(--color-surface-container-low)",
                  }}
                >
                  {/* Feature name */}
                  <div
                    className="px-5 py-4 text-sm font-semibold text-on-surface"
                    style={{
                      borderRight: "1px solid var(--color-outline-variant)",
                    }}
                  >
                    {featureName}
                  </div>

                  {/* Values */}
                  {values.map((val, valIdx) => {
                    const isYou = valIdx === 0;
                    return (
                      <div
                        key={valIdx}
                        className="px-4 py-4 flex items-center justify-center"
                        style={{
                          borderRight:
                            valIdx < values.length - 1
                              ? "1px solid var(--color-outline-variant)"
                              : "none",
                          background: isYou
                            ? "var(--color-primary-container)/8"
                            : "transparent",
                        }}
                      >
                        <CellValue
                          value={val}
                          isYou={isYou}
                          isScoreRow={isScoreRow}
                          isReviewRow={isReviewRow}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div
            className="px-5 py-3 text-[11px] text-on-surface-variant flex items-center gap-2"
            style={{
              borderTop: "1px solid var(--color-outline-variant)",
              background: "var(--color-surface-container-low)",
            }}
          >
            <span>⏱</span>
            Generated{" "}
            {benchmark.generatedAt
              ? new Date(benchmark.generatedAt).toLocaleString()
              : "recently"}
            &nbsp;·&nbsp;
            {competitorCount} competitor{competitorCount !== 1 ? "s" : ""}{" "}
            benchmarked
          </div>
        </div>
      )}
    </div>
  );
};

export default Competitors;
