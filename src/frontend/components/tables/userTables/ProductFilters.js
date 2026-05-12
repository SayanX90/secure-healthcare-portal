"use client";

import { Search, ArrowUpDown, Calendar, X } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT FILTERS — The search bar + filter dropdowns shown above the products table.

// ─────────────────────────────────────────────────────────────────────────────
export default function ProductFilters({
  // ── Current filter values (what to display in each input) ──
  searchQuery,
  statusFilter,
  userFilter,
  dateFrom,
  dateTo,
  sortDir,
  uniqueUsers,

  // ── Callback functions (what to do when admin changes a filter) ──
  onSearchChange,
  onStatusChange,
  onUserChange,
  onDateFrom,
  onDateTo,
  onSortToggle,
  onClearAll,
}) {

  // ── Check if any filter is active ──
  // If at least one filter is set, we show the "Clear Filters" button.
  // If all filters are at their default ("", "all"), we hide it.
  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    userFilter !== "all" ||
    dateFrom ||
    dateTo;

  return (
    <div className="flex flex-col gap-3 border-b border-border p-6">

      {/* ────────────────────────────────────────────────────────── */}
      {/* ROW 1: Search Input + Sort Button                        */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        {/* Search Input */}
        {/* Admin can search by customer name, product name, serial number, or user */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            id="admin-product-search"
            placeholder="Search by customer, product, serial, or user..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground focus-ring transition-colors"
          />
        </div>

        {/* Sort Toggle Button */}
        {/* Clicking this flips between "Newest First" and "Oldest First" */}
        <button
          onClick={onSortToggle}
          title={sortDir === "desc" ? "Showing newest first" : "Showing oldest first"}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-black/5 transition-colors shrink-0"
        >
          <ArrowUpDown className="h-4 w-4" />
          {sortDir === "desc" ? "Newest First" : "Oldest First"}
        </button>

      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ROW 2: Status Dropdown + User Dropdown + Date Range      */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

        {/* Status Dropdown */}
        {/* Options: All Status, Pending, Approved, Rejected */}
        <select
          id="admin-status-filter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 w-full sm:w-auto rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-ring transition-colors"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* User Dropdown */}
        {/* Lists every unique user who submitted a product.        */}

        <select
          id="admin-user-filter"
          value={userFilter}
          onChange={(e) => onUserChange(e.target.value)}
          className="h-10 w-full sm:w-auto rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-ring transition-colors"
        >
          <option value="all">All Users</option>
          {uniqueUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        {/* Date Range: From date – To date */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">

          {/* "From" date picker */}
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <Calendar className="h-4 w-4 text-muted shrink-0" />
            <input
              type="date"
              id="admin-date-from"
              value={dateFrom}
              onChange={(e) => onDateFrom(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-ring transition-colors"
            />
          </div>

          {/* Dash between the two date pickers */}
          <span className="hidden sm:block text-muted text-sm">–</span>

          {/* "To" date picker */}
          <input
            type="date"
            id="admin-date-to"
            value={dateTo}
            onChange={(e) => onDateTo(e.target.value)}
            className="h-10 w-full sm:w-auto rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-ring transition-colors"
          />

        </div>

        {/* Clear Filters Button */}
        {/* Only visible when at least one filter is active.        */}
        {/* Clicking it resets ALL filters back to their defaults.  */}
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted hover:text-foreground hover:bg-black/5 transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Clear Filters
          </button>
        )}

      </div>
    </div>
  );
}
