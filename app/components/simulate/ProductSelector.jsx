import { useEffect, useMemo, useRef, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { productApi } from "../../lib/api";

export default function ProductSelector({ token, value, onChange, dropdownPosition = "bottom", pageSize=20 }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageInput, setPageInput] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const {
    data: productsData,
    loading: productsLoading,
  } = useApi(
    token
      ? () =>
          productApi.list({
            page,
            limit: pageSize,
            search: search.trim(),
          })
      : null,
    [token, page, search],
  );

  const products = useMemo(() => {
    const list = productsData?.data ?? productsData?.products ?? [];
    return Array.isArray(list) ? list : [];
  }, [productsData]);

  const pagination = productsData?.pagination ?? null;

  useEffect(() => {
    setPageInput(page);
  }, [page]);

  useEffect(() => {
    if (products.length && !value) {
      onChange(products[0]._id);
    }
  }, [products, value, onChange]);

  const selectedProduct =
    products.find((p) => p._id === value) || products[0] || null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);
  const dropdownClass =
  dropdownPosition === "top"
    ? "absolute bottom-full mb-2 left-0 w-full"
    : "absolute top-full mt-2 left-0 w-full";
  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Product */}
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

      {isOpen && (
          // <div
          // className="absolute  left-0 mt-2 w-full rounded-2xl overflow-hidden z-50"
          <div
  className={`${dropdownClass} rounded-2xl overflow-hidden z-50`}
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
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                
              }}
              placeholder="Search products"
              className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-on-surface outline-none"
              style={{
                background: "rgba(255,248,240,.95)",
                border: "1px solid rgba(28,36,84,.12)",
                color: "var(--color-on-surface)",
              }}
            />
          </div>
                    {productsLoading && (
            <div className="px-5 py-3 text-on-surface-variant text-sm">
              Loading...
            </div>
          )}

          {!productsLoading && !products.length && (
            <div className="px-5 py-3 text-sm text-on-surface-variant">
              No products found
            </div>
          )}

          {!productsLoading &&
            products.map((p) => (
              <button
                key={p._id}
                type="button"
                onClick={() => {
                  onChange(p._id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 transition-all duration-200 ${
                  value === p._id
                    ? "bg-[#1C2454] text-white"
                    : "text-on-surface hover:bg-[rgba(28,36,84,0.08)]"
                }`}
                onMouseEnter={(e) => {
                  if (value !== p._id) {
                    e.currentTarget.style.background = "#F7EFD9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== p._id) {
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
                  setPage((prev) => Math.max(1, prev - 1))
                }
                disabled={page <= 1}
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
                  onChange={(e) =>
                    setPageInput(Number(e.target.value))
                  }
                  className="w-14 rounded-lg border border-[rgba(28,36,84,0.12)] px-2 py-1 text-center text-sm outline-none"
                  style={{
                    background: "rgba(255,248,240,.95)",
                  }}
                />

                <span className="text-xs font-semibold text-on-surface-variant">
                  / {pagination.totalPages || 1}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const nextPage = Math.min(
                      Math.max(1, Number(pageInput) || 1),
                      pagination.totalPages || 1
                    );
                    setPage(nextPage);
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
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                disabled={page >= (pagination.totalPages || 1)}
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
  );
}