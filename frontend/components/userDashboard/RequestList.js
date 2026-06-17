"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  CheckCircle2,
  X,
  Eye,
  User,
  Loader2,
  ClipboardList,
  Phone,
} from "lucide-react";

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * formatDate: Takes a date string from the database and makes it readable.
 * Example: "2026-05-31T00:00:00.000Z" becomes "May 31, 2026"
 */
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

/**
 * ServiceStatusBadge: Shows a colored pill badge based on the request status.
 */
function ServiceStatusBadge({ status }) {
  // Each status gets its own color
  const styles = {
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Assigned: "border-blue-200 bg-blue-50 text-blue-700",
    InProgress: "border-indigo-200 bg-indigo-50 text-indigo-700",
    Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  // Each status gets its own icon
  const icons = {
    Pending: <Clock className="h-3.5 w-3.5" />,
    Assigned: <User className="h-3.5 w-3.5" />,
    InProgress: <Loader2 className="h-3.5 w-3.5" />,
    Resolved: <CheckCircle2 className="h-3.5 w-3.5" />,
    Cancelled: <X className="h-3.5 w-3.5" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Pending}`}>
      {icons[status] || icons.Pending} {status}
    </span>
  );
}

/**
 * truncateText: Cuts text to a max length and adds "..." at the end.
 */
function truncateText(text, maxLength = 60) {
  if (!text) return "—";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * ============================================================================
 * MAIN COMPONENT: REQUEST LIST
 * ============================================================================
 *
 * This component displays a searchable, filterable table of all service requests.
 * It follows the same layout pattern as ProductList.js.
 *
 * Props:
 * - requests: An array of service request objects from the database.
 */
export default function RequestList({ requests }) {
  // ------------------------------------------------------------------------
  // 1. STATE VARIABLES
  // ------------------------------------------------------------------------

  // What the user types into the search box
  const [searchText, setSearchText] = useState("");

  // What the user selects from the status dropdown
  const [statusFilter, setStatusFilter] = useState("all");

  // ------------------------------------------------------------------------
  // 2. FILTERING LOGIC
  // ------------------------------------------------------------------------

  const filteredRequests = requests.filter((req) => {
    // A. Check if it matches the SEARCH BOX
    const lowerSearch = searchText.toLowerCase();
    const productName = req.productId?.productName || "";
    const description = req.problemDescription || "";
    const matchesSearch =
      productName.toLowerCase().includes(lowerSearch) ||
      description.toLowerCase().includes(lowerSearch);

    // B. Check if it matches the DROPDOWN FILTER
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ------------------------------------------------------------------------
  // 3. RENDER UI
  // ------------------------------------------------------------------------
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-[#F8FAFC] dark:bg-none dark:bg-card shadow-sm">

      {/* --- Top Bar: Search + Filter --- */}
      <div className="flex flex-col gap-3 border-b border-border p-6 md:flex-row md:items-center md:justify-between">

        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            id="my-requests-search"
            placeholder="Search by product name or description..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground focus-ring transition-colors"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <select
            id="my-requests-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full sm:w-auto rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-ring transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* --- Main Area --- */}

      {/* Scenario A: No requests found */}
      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 mb-4">
            <ClipboardList className="h-8 w-8 text-muted" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No requests found</h3>
          <p className="mt-1 text-sm text-muted max-w-md">
            {requests.length === 0
              ? "You haven't submitted any service requests yet."
              : "No requests match your search criteria."}
          </p>
        </div>
      ) : (
        <>
          {/* 1. Mobile View (Cards) - Hidden on PC */}
          <div className="block sm:hidden divide-y divide-border">
            {filteredRequests.map((req) => (
              <div key={req._id} className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      {req.productId?.productName || "Unknown Product"}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {formatDate(req.createdAt)}
                    </p>
                  </div>
                  <ServiceStatusBadge status={req.status} />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {req.contactNumber}
                </div>

                <p className="text-xs text-muted">
                  {truncateText(req.problemDescription, 60)}
                </p>

                <Link
                  href={`/dashboard/requests/${req._id}`}
                  className="mt-1 inline-flex items-center gap-1.5 self-start rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-black/5 transition-colors focus-ring min-h-[40px]"
                >
                  <Eye className="h-3.5 w-3.5" /> View Details
                </Link>
              </div>
            ))}
          </div>

          {/* 2. Desktop View (Table) - Hidden on Mobile */}
          <div className="hidden sm:block overflow-x-auto w-full">
            <table className="w-full min-w-[600px] text-left text-sm text-muted">
              <thead className="bg-black/[0.02] dark:bg-white/[0.02] text-xs uppercase text-foreground whitespace-nowrap">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-xl">Product Name</th>
                  <th className="px-6 py-4 font-semibold">Request Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Contact Number</th>
                  <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border whitespace-nowrap">
                {filteredRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="transition-colors even:bg-black/[0.02] dark:even:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">
                        {req.productId?.productName || "Unknown Product"}
                      </div>
                      <div className="text-xs">
                        {truncateText(req.problemDescription, 60)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {formatDate(req.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <ServiceStatusBadge status={req.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {req.contactNumber}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/requests/${req._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-ring"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
