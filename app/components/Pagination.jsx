import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination — generic pager for any { page, totalPages } shaped result.
 *
 *   <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
 */
export default function Pagination({
  page,
  totalPages,
  onChange,
  className = "",
}) {
  const [jump, setJump] = useState(page);
  useEffect(() => setJump(page), [page]);

  if (!totalPages || totalPages <= 1) return null;

  function go(p) {
    const clamped = Math.min(Math.max(1, p), totalPages);
    onChange(clamped);
  }

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none  cursor-pointer"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Prev
      </button>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jump}
          onChange={(e) => setJump(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && go(jump)}
          onBlur={() => go(jump)}
          className="w-12 text-black rounded-lg border border-outline-variant bg-surface-container-lowest px-2 py-1 text-center text-[12px] font-semibold outline-none focus:border-primary"
        />
        <span className="font-mono-sm text-[11px] text-on-surface-variant">
          / {totalPages}
        </span>
      </div>

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none  cursor-pointer"
      >
        Next
        <ChevronRight size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
