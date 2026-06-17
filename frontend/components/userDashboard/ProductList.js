"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Calendar,
  Search,
  CheckCircle2,
  X,
  Clock,
  Eye,
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

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * StatusBadge: A tiny component that shows a colored pill/badge
 * based on whether the product is Approved (Green), Pending (Yellow), or Rejected (Red).
 */
function StatusBadge({ status }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" /> Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        <X className="h-3.5 w-3.5" /> Rejected
      </span>
    );
  }

  // If not approved or rejected, default to pending
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Clock className="h-3.5 w-3.5" /> Pending
    </span>
  );
}

/**
 * ============================================================================
 * MAIN COMPONENT: PRODUCT LIST
 * ============================================================================
 * 
 * This component displays the list of products a user has registered.
 * It handles the search bar, the status filter, and shows either a table (on PC)
 * or a list of cards (on mobile phones).
 * 
 * Props:
 * - products: An array (list) of product objects fetched from the database.
 */
export default function ProductList({ products }) {
  // ------------------------------------------------------------------------
  // 1. STATE VARIABLES (Memory for this component)
  // ------------------------------------------------------------------------
  
  // What the user has typed into the search box
  const [searchText, setSearchText] = useState("");

  // What the user has selected in the dropdown (e.g., "all", "approved", "pending")
  const [statusFilter, setStatusFilter] = useState("all");

  // ------------------------------------------------------------------------
  // 2. FILTERING LOGIC
  // ------------------------------------------------------------------------
  
  // We don't want to show ALL products if the user is searching or filtering.
  // We create a new, smaller list called `filteredProducts` based on the search/filter.
  const filteredProducts = products.filter((product) => {
    // A. Check if it matches the SEARCH BOX
    const lowerSearch = searchText.toLowerCase();
    const nameMatches = product.productName.toLowerCase().includes(lowerSearch);
    
    // Check if any of the serial numbers match the search
    const serialMatches = product.serialNumbers?.some((sn) =>
      sn.toLowerCase().includes(lowerSearch)
    );
    const matchesSearch = nameMatches || serialMatches;

    // B. Check if it matches the DROPDOWN FILTER
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;

    // It must match BOTH the search box AND the dropdown to be shown
    return matchesSearch && matchesStatus;
  });


  // ------------------------------------------------------------------------
  // 3. RENDER UI
  // ------------------------------------------------------------------------
  return (
    <>
      {/* Main card container holding everything */}
      <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-[#F8FAFC] dark:bg-none dark:bg-card shadow-sm">
        
        {/* --- Top Bar: Search Input, Filter Dropdown, Register Button --- */}
        <div className="flex flex-col gap-3 border-b border-border p-6 md:flex-row md:items-center md:justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              id="my-products-search"
              placeholder="Search products or serial numbers..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)} // Update state when user types
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground focus-ring transition-colors"
            />
          </div>

          {/* Filter Dropdown + Register New Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <select
              id="my-products-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)} // Update state when user selects an option
              className="h-10 w-full sm:w-auto rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-ring transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <Link
              href="/dashboard/products/register"
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 shadow-sm"
            >
              <Package className="h-4 w-4" /> Register New
            </Link>
          </div>
        </div>

        {/* --- Middle Area: The actual list of products --- */}
        
        {/* Scenario A: No products found (either empty list, or search didn't match anything) */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 mb-4">
              <Package className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              No products found
            </h3>
            <p className="mt-1 text-sm text-muted max-w-md">
              {products.length === 0
                ? "You haven't registered any products yet."
                : "No products match your search criteria."}
            </p>
          </div>
        ) : (
          
          /* Scenario B: We found products, so show them! */
          <>
            {/* 1. Mobile View (Cards) - Hidden on PC */}
            <div className="block sm:hidden divide-y divide-border">
              {filteredProducts.map((product) => (
                <div key={product._id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {product.productName}
                      </p>
                      <p className="text-xs text-muted">
                        Model: {product.productModel}
                      </p>
                    </div>
                    <StatusBadge status={product.status} />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {formatDate(product.warrantyFrom)} –{" "}
                    {formatDate(product.warrantyTo)}
                  </div>

                  {product.serialNumbers?.length > 0 && (
                    <p className="text-xs text-muted truncate">
                      S/N: {product.serialNumbers.join(", ")}
                    </p>
                  )}

                  {/* Navigates to our new dedicated Product Details page */}
                  <Link
                    href={`/dashboard/products/${product._id}`}
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
                    <th className="px-6 py-4 font-semibold rounded-tl-xl">Product</th>
                    <th className="px-6 py-4 font-semibold">Serial Number</th>
                    <th className="px-6 py-4 font-semibold">Warranty</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border whitespace-nowrap">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="transition-colors even:bg-black/[0.02] dark:even:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">
                          {product.productName}
                        </div>
                        <div className="text-xs">
                          Model: {product.productModel}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {product.serialNumbers?.join(", ")}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          <Calendar className="h-3.5 w-3.5 text-muted" />
                          {formatDate(product.warrantyFrom)} -{" "}
                          {formatDate(product.warrantyTo)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={product.status} />
                      </td>

                      <td className="px-6 py-4">
                        {/* Navigates to our new dedicated Product Details page */}
                        <Link
                          href={`/dashboard/products/${product._id}`}
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
    </>
  );
}
