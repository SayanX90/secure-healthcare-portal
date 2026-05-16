"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// ProductPagination: shows "Showing X to Y of Z" text and Prev/Next buttons.
// Returns nothing when there is only one page (no need to show pagination).
// Props:
//   currentPage  — the page the user is on right now (starts at 1)
//   totalPages   — how many pages exist in total
//   totalItems   — how many products match the current filters
//   itemsPerPage — how many products are shown per page
//   onPrev       — called when the Prev button is clicked
//   onNext       — called when the Next button is clicked
export default function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPrev,
  onNext,
}) {
  // Don't render anything when all results fit on one page
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to   = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-border p-6">
      {/* Result count text */}
      <p className="text-sm text-muted font-medium">
        Showing <span className="font-bold text-foreground">{from}</span> to{" "}
        <span className="font-bold text-foreground">{to}</span> of{" "}
        <span className="font-bold text-foreground">{totalItems}</span> products
      </p>

      {/* Prev / Next buttons */}
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold transition-colors hover:bg-black/5 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold transition-colors hover:bg-black/5 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
