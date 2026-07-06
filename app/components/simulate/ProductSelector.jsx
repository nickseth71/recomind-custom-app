// src/pages/simulate/ProductSelector.jsx
import { useEffect, useRef, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { productApi } from "../../lib/api";
import { inputCls } from "./SimulateShared";

export default function ProductSelector({ token, value, onChange }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pageInput, setPageInput] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { data: res, loading } = useApi(
    token
      ? () => productApi.list({ page, limit: 20, search: search.trim() })
      : null,
    [token, page, search],
  );

  const products = res?.data ?? res?.products ?? [];
  const pagination = res?.pagination ?? null;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    setPageInput(page);
  }, [page]);

  useEffect(() => {
    if (products.length && !value) {
      onChange(products[0]._id);
    }
  }, [products, value, onChange]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch() {
    setSearch(searchInput);
    setPage(1);
    setIsOpen(true);
  }

  function handlePageGo() {
    const next = Math.min(
      Math.max(1, Number(pageInput) || 1),
      pagination?.totalPages || 1,
    );
    setPage(next);
  }

  const selected = products.find((item) => item._id === value);

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search products…"
          className={`${inputCls} flex-1`}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="rounded-2xl bg-surface-container-low border border-outline-variant px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-high transition shrink-0"
        >
          Search
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={loading || !products.length}
        className="w-full rounded-2xl border border-outline-variant bg-surface-container-highest px-4 py-3 text-left text-sm font-semibold text-on-surface transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected?.title ||
          (loading
            ? "Loading products…"
            : products.length
              ? "Select a product…"
              : "No products found")}
      </button>

      {isOpen && (
        <div className="rounded-2xl border border-outline-variant bg-surface-container-highest shadow-lg shadow-surface-dark/10 overflow-hidden">
          <div className="border-b border-outline-variant px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
              Choose product
            </p>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-on-surface-variant">
                Loading products…
              </div>
            ) : !products.length ? (
              <div className="p-4 text-sm text-on-surface-variant">
                No products found
              </div>
            ) : (
              products.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => {
                    onChange(product._id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition ${
                    product._id === value
                      ? "bg-primary text-on-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {product.title}
                </button>
              ))
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-outline-variant px-4 py-3 bg-surface-container-low">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-xl border border-outline-variant bg-surface-container-highest px-3 py-1.5 text-xs font-semibold text-on-surface disabled:opacity-40"
              >
                ← Prev
              </button>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max={pagination.totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(Number(e.target.value))}
                  className="w-14 rounded-xl border border-outline-variant bg-surface-container-highest px-2 py-1.5 text-center text-xs outline-none"
                />
                <span className="text-xs text-on-surface-variant">
                  / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={handlePageGo}
                  className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-on-primary"
                >
                  Go
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page >= pagination.totalPages}
                className="rounded-xl border border-outline-variant bg-surface-container-highest px-3 py-1.5 text-xs font-semibold text-on-surface disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
