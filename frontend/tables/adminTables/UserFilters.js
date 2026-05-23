"use client";

import { Search } from "lucide-react";

// ─── USER FILTERS COMPONENT ──────────────────────────────────────────────────
// This component displays the search bar and the role/status dropdowns at the top of the user table.
// It receives the current filter values as "props" and calls specific functions when they change.
export default function UserFilters({
  searchQuery,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-border p-5 md:flex-row md:items-center md:justify-between bg-white dark:bg-card">

      {/* ── STEP 1: Search Input ── */}
      {/* This input lets the user type a name or phone. As they type, it triggers the 'onSearchChange' function. */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search users by name or phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-background shadow-sm pl-10 pr-4 text-sm text-slate-800 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-muted focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all duration-200"
        />
      </div>

      {/* ── STEP 2: Dropdown Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        
        {/* Role Dropdown */}
        {/* Allows filtering by All Roles, Admin, or User */}
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="h-10 w-full sm:w-auto rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-background shadow-sm px-4 text-sm text-slate-700 dark:text-foreground focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all duration-200 font-medium cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        {/* Status Dropdown */}
        {/* Allows filtering by All Statuses, Approved, or Pending */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 w-full sm:w-auto rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-background shadow-sm px-4 text-sm text-slate-700 dark:text-foreground focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all duration-200 font-medium cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

    </div>
  );
}
