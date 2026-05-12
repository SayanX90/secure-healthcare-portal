"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { CheckCircle2, X, Package, FileText } from "lucide-react";

// These are smaller components that live in their own files.
import ProductRow, { StatusBadge, formatDate } from "./ProductRow";
import ProductFilters from "./ProductFilters";
import ProductPagination from "./ProductPagination";


function ProductModal({ product, isOpen, onClose, onApprove, onReject, isBusy }) {

  // If the modal is not open or no product selected, don't render anything.
  if (!isOpen || !product) return null;

  return (
    // Dark overlay behind the modal
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Clicking the dark background closes the modal */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* The white modal box */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Product Registration Details</h2>
              <p className="text-xs text-slate-500">Submitted on {formatDate(product.createdAt)}</p>
            </div>
          </div>
          {/* Close button (X icon) */}
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable Content Area ── */}
        <div className="overflow-y-auto max-h-[80vh] p-6 space-y-4 scroll-smooth">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Customer Information</h3>
              <div className="space-y-3 text-sm">
                <div><span className="font-semibold text-slate-700 block">Name:</span> <span className="text-slate-600">{product.customerName}</span></div>
                <div><span className="font-semibold text-slate-700 block">Address:</span> <span className="text-slate-600">{product.customerAddress}</span></div>
                <div><span className="font-semibold text-slate-700 block">Submitted By (User):</span> <span className="text-slate-600">{product.userId?.name} ({product.userId?.email})</span></div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div><span className="font-semibold text-slate-700 block">Product:</span> <span className="text-slate-600">{product.productName}</span></div>
                <div><span className="font-semibold text-slate-700 block">Model:</span> <span className="text-slate-600">{product.productModel}</span></div>
                <div><span className="font-semibold text-slate-700 block">Quantity:</span> <span className="text-slate-600">{product.quantity}</span></div>
                <div><span className="font-semibold text-slate-700 block">Serial Numbers:</span> <span className="text-slate-600">{product.serialNumbers?.join(", ")}</span></div>
              </div>
            </div>

            {/* Warranty & Installation */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Warranty &amp; Installation</h3>
              <div className="space-y-3 text-sm">
                <div><span className="font-semibold text-slate-700 block">Warranty Period:</span> <span className="text-slate-600">{formatDate(product.warrantyFrom)} – {formatDate(product.warrantyTo)}</span></div>
                <div><span className="font-semibold text-slate-700 block">Invoice Number:</span> <span className="text-slate-600">{product.invoiceNumber}</span></div>
                {product.suppliedBy && <div><span className="font-semibold text-slate-700 block">Supplied By:</span>  <span className="text-slate-600">{product.suppliedBy}</span></div>}
                {product.installedBy && <div><span className="font-semibold text-slate-700 block">Installed By:</span> <span className="text-slate-600">{product.installedBy}</span></div>}
                {product.salesPerson && <div><span className="font-semibold text-slate-700 block">Sales Person:</span> <span className="text-slate-600">{product.salesPerson}</span></div>}
              </div>
            </div>

            {/* Documents & Photos */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Documents &amp; Photos</h3>
              <div className="space-y-2">
                {product.installationCopyUrl ? (
                  <a href={product.installationCopyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-lg font-medium transition-colors">
                    <FileText className="h-4 w-4" /> View Installation Copy
                  </a>
                ) : <span className="text-sm text-slate-400 italic block">No installation copy uploaded</span>}

                {product.invoiceCopyUrl ? (
                  <a href={product.invoiceCopyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-lg font-medium transition-colors">
                    <FileText className="h-4 w-4" /> View Invoice Copy
                  </a>
                ) : <span className="text-sm text-slate-400 italic block">No invoice copy uploaded</span>}
              </div>

              {/* Installation Photos (small thumbnail images) */}
              {product.installationPhotosUrls?.length > 0 && (
                <div className="mt-4">
                  <span className="font-semibold text-slate-700 text-sm block mb-2">
                    Installation Photos ({product.installationPhotosUrls.length})
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.installationPhotosUrls.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noreferrer" className="shrink-0">
                        <Image src={url} alt={`Install ${idx}`} width={64} height={64} className="object-cover rounded-lg border border-slate-200 hover:border-indigo-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Remarks (only shown if the product has remarks) */}
            {product.remarks && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Remarks</h3>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 border border-slate-100">
                  {product.remarks}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer: Status + Approve/Reject Buttons ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 p-4 sm:p-6 bg-slate-50/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-semibold text-slate-700">Current Status:</span>
            <StatusBadge status={product.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Show "Reject" button only if the product is NOT already rejected */}
            {product.status !== "rejected" && (
              <button
                onClick={() => onReject(product._id)}
                disabled={isBusy}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
              >
                {isBusy ? "Processing…" : "Reject"}
              </button>
            )}
            {/* Show "Approve" button only if the product is NOT already approved */}
            {product.status !== "approved" && (
              <button
                onClick={() => onApprove(product._id)}
                disabled={isBusy}
                className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isBusy ? "Processing…" : "Approve"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS TABLE — The main component shown on /admin/products.
//
// HOW IT WORKS (simple version):
//   1. Receives all products from ProductsPage.js (server component).
//   2. Lets the admin search, filter by status/user/date, and sort.
//   3. Shows only 10 products at a time (pagination).
//   4. Clicking "View" opens the ProductModal popup.
//   5. Admin can Approve or Reject a product from the modal.
//
// Props:
//   - products (array) → all product registrations from the database
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductsTable({ products }) {

  // useRouter lets us refresh the page data after approving/rejecting.
  const router = useRouter();


  // ── STEP 1: Set Up All the State Variables ──
  // These store what the admin is currently searching/filtering/viewing.

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortDir, setSortDir] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [busyId, setBusyId] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  // How many products to show per page
  const itemsPerPage = 10;


  // When any filter changes, go back to page 1
  function resetPage() {
    setCurrentPage(1);
  }


  // ── STEP 2: Build a List of Unique Users (for the "User" dropdown filter) ──
  // We loop through all products and collect each unique user who submitted one.
  // Example result: [{ id: "abc", name: "Rohan", email: "rohan@..." }, ...]
  const uniqueUsers = useMemo(() => {
    const seen = new Map();
    products.forEach((p) => {
      if (p.userId?._id && !seen.has(p.userId._id)) {
        seen.set(p.userId._id, {
          id: p.userId._id,
          name: p.userId.name,
          email: p.userId.email,
        });
      }
    });
    return Array.from(seen.values());
  }, [products]);


  // ── STEP 3: Filter and Sort the Products ──
  // This runs automatically whenever any filter/search/sort value changes.
  // It takes ALL products → keeps only matching ones → sorts them.
  const filteredProducts = useMemo(() => {

    // Convert search text to lowercase for case-insensitive matching
    const searchText = searchQuery.toLowerCase();

    // Convert date strings to timestamps (numbers) for easy comparison.
    // If no date is selected, set to null (meaning "no filter").
    // Example: "2026-05-01" becomes a number like 1777363200000
    let fromTimestamp = null;
    if (dateFrom) {
      fromTimestamp = new Date(dateFrom).getTime();
    }

    let toTimestamp = null;
    if (dateTo) {
      // Add "T23:59:59" so the end date includes the entire day
      toTimestamp = new Date(dateTo + "T23:59:59").getTime();
    }

    // ── Filter: keep only products that match ALL active filters ──
    const filtered = products.filter((p) => {

      // Search filter: does any field contain the search text?
      // If searchText is empty, everything passes (no filter active).
      let matchesSearch = true;
      if (searchText) {
        matchesSearch =
          p.customerName.toLowerCase().includes(searchText) ||
          p.productName.toLowerCase().includes(searchText) ||
          p.serialNumbers?.some((sn) => sn.toLowerCase().includes(searchText)) ||
          (p.userId?.email && p.userId.email.toLowerCase().includes(searchText)) ||
          (p.userId?.name && p.userId.name.toLowerCase().includes(searchText));
      }

      // Status filter: "all" means show everything
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;

      // User filter: "all" means show all users' products
      const matchesUser = userFilter === "all" || p.userId?._id === userFilter;

      // Date filters: check if the product was created within the selected range
      const createdTimestamp = new Date(p.createdAt).getTime();
      const matchesFrom = !fromTimestamp || createdTimestamp >= fromTimestamp;
      const matchesTo = !toTimestamp || createdTimestamp <= toTimestamp;

      // Keep this product only if it passes ALL checks
      return matchesSearch && matchesStatus && matchesUser && matchesFrom && matchesTo;
    });

    // ── Sort: order by date (newest first or oldest first) ──
    // We make a copy with [...filtered] so we don't change the original array.
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortDir === "desc") {
        // Newest first: higher date comes first
        return dateB - dateA;
      } else {
        // Oldest first: lower date comes first
        return dateA - dateB;
      }
    });

    return sorted;

  }, [products, searchQuery, statusFilter, userFilter, dateFrom, dateTo, sortDir]);


  // ── STEP 4: Pagination — Pick Only 10 Products for the Current Page ──
  //
  // Example with 25 products and 10 per page:
  //   Page 1 → show products  0 to  9  (first 10)
  //   Page 2 → show products 10 to 19  (next 10)
  //   Page 3 → show products 20 to 24  (last 5)
  //
  // How totalPages works:
  //   25 products / 10 per page = 2.5 → round up to 3 pages
  //
  // How slice works:
  //   Page 1: slice(0, 10)   → items 0,1,2...9
  //   Page 2: slice(10, 20)  → items 10,11,12...19
  //   Page 3: slice(20, 30)  → items 20,21,22,23,24

  // Calculate how many pages we need
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get only the products for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);


  // ── STEP 5: Handle Approve / Reject Actions ──
  // Called when the admin confirms "Yes, Approve" or "Yes, Reject" in the popup.
  async function performAction(id, action) {
    // Close the confirmation popup
    setConfirmAction(null);
    // Mark this product as busy (shows loading state)
    setBusyId(id);

    try {
      // Send PATCH request to update the product status
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      const data = await res.json();

      // If the server returned an error, throw it
      if (!res.ok) {
        throw new Error(data.message || "Action failed");
      }

      // Show success notification and close the modal
      toast.success(data.message || "Success");
      setSelectedProduct(null);

      // Refresh the page to get updated data from the server
      router.refresh();

    } catch (err) {
      // Show error notification
      toast.error(err.message || "Network error");
    } finally {
      // Clear busy state (re-enables buttons)
      setBusyId("");
    }
  }


  // ── STEP 6: Render the UI ──
  return (
    <>
      {/* ── Confirmation Popup ("Are you sure?" dialog) ── */}
      {/* This appears AFTER admin clicks Approve/Reject in the modal,
          asking them to confirm before actually performing the action. */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {confirmAction.action === "approved" ? "Approve Registration?" : "Reject Registration?"}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {confirmAction.action === "approved"
                ? "This will mark the product as approved and notify the user by email."
                : "This will reject the registration and notify the user by email."}
            </p>
            <div className="flex gap-3">
              {/* Cancel button — closes the confirmation popup */}
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              {/* Confirm button — actually performs the approve/reject */}
              <button
                onClick={() => performAction(confirmAction.id, confirmAction.action)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold text-white transition-colors ${confirmAction.action === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {confirmAction.action === "approved" ? "Yes, Approve" : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Detail Modal (hidden until "View" is clicked) ── */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onApprove={(id) => setConfirmAction({ id, action: "approved" })}
        onReject={(id) => setConfirmAction({ id, action: "rejected" })}
        isBusy={!!busyId}
      />

      {/* ── The Table Section ── */}
      <section className="mt-8 rounded-2xl border border-border bg-gradient-to-b from-white to-[#F8FAFC] dark:bg-none dark:bg-card shadow-sm">

        {/* ── Search Bar + All Dropdown Filters ── */}
        <ProductFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          userFilter={userFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
          sortDir={sortDir}
          uniqueUsers={uniqueUsers}
          onSearchChange={(val) => { setSearchQuery(val); resetPage(); }}
          onStatusChange={(val) => { setStatusFilter(val); resetPage(); }}
          onUserChange={(val) => { setUserFilter(val); resetPage(); }}
          onDateFrom={(val) => { setDateFrom(val); resetPage(); }}
          onDateTo={(val) => { setDateTo(val); resetPage(); }}
          onSortToggle={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
          onClearAll={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setUserFilter("all");
            setDateFrom("");
            setDateTo("");
            resetPage();
          }}
        />

        {/* ── Show "No products found" or the Table ── */}
        {filteredProducts.length === 0 ? (

          // Empty state: no products match the current filters
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 mb-4">
              <Package className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No products found</h3>
            <p className="mt-1 text-sm text-muted max-w-md">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>

        ) : (

          // The actual table with product rows
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[600px] text-left text-sm text-muted">

              {/* Table header: column names */}
              <thead className="bg-black/[0.02] dark:bg-white/[0.02] text-xs uppercase text-foreground whitespace-nowrap">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-xl">Customer &amp; Product</th>
                  <th className="px-6 py-4 font-semibold">Serial &amp; Invoice</th>
                  <th className="px-6 py-4 font-semibold">Warranty</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold rounded-tr-xl">Actions</th>
                </tr>
              </thead>

              {/* Table body: one ProductRow per product */}
              <tbody className="divide-y divide-border whitespace-nowrap">
                {paginatedProducts.map((p) => (
                  <ProductRow
                    key={p._id}
                    product={p}
                    onView={setSelectedProduct}
                  />
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* ── Prev/Next Pagination Buttons ── */}
        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        />

      </section>
    </>
  );
}
