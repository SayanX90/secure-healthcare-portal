"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── USER PAGINATION COMPONENT ───────────────────────────────────────────────
// This component manages the "Previous" and "Next" buttons at the bottom of the table.

export default function UserPagination({
  currentPage,   // The page number we are currently viewing
  totalPages,    // The total number of pages available
  totalItems,    // The total number of users found after filtering
  itemsPerPage,  // How many users we show on one single page
  onPrev,        // Function to run when "Prev" is clicked
  onNext,        // Function to run when "Next" is clicked
}) {

  // ── STEP 1: Check if Pagination is Needed ──
  // If there's only 1 page of results (or 0), hide the pagination completely.
  if (totalPages <= 1) return null;

  // ── STEP 2: Calculate Numbers to Display ──
  // Math to figure out "Showing X to Y"
  // Example: If on page 2 and showing 10 per page, 'from' is 11.
  const from = (currentPage - 1) * itemsPerPage + 1;
  // Example: 'to' will be 20, unless totalItems is only 15, then it caps at 15.
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4">

      {/* ── STEP 3: Display Result Count Text ── */}
      <p className="text-sm text-muted">
        Showing <span className="font-medium text-foreground">{from}</span> to{" "}
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span> results
      </p>

      {/* ── STEP 4: Display Prev/Next Buttons ── */}
      <div className="flex gap-2">
        {/* Previous Button */}
        {/* It is disabled (grayed out and unclickable) if we are already on Page 1 */}
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="flex h-9 items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Prev
        </button>

        {/* Next Button */}
        {/* It is disabled if we are on the very last page */}
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="flex h-9 items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 transition-colors"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
