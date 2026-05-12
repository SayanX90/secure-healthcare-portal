"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Calendar, Search, CheckCircle2, X, Clock, Eye, FileText } from "lucide-react";
import Link from "next/link";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

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
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Clock className="h-3.5 w-3.5" /> Pending
    </span>
  );
}

function ProductModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registration Details</h2>
              <p className="text-xs text-slate-500">Submitted on {formatDate(product.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[80vh] p-4 sm:p-6 space-y-4 scroll-smooth">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Product</h3>
              <div className="space-y-3 text-sm">
                <div><span className="font-semibold text-slate-700 block">Name:</span> <span className="text-slate-600">{product.productName}</span></div>
                <div><span className="font-semibold text-slate-700 block">Model:</span> <span className="text-slate-600">{product.productModel}</span></div>
                <div><span className="font-semibold text-slate-700 block">Quantity:</span> <span className="text-slate-600">{product.quantity}</span></div>
                <div><span className="font-semibold text-slate-700 block">Serial Numbers:</span> <span className="text-slate-600">{product.serialNumbers?.join(", ")}</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Warranty & Status</h3>
              <div className="space-y-3 text-sm">
                <div><span className="font-semibold text-slate-700 block">Status:</span> <StatusBadge status={product.status} /></div>
                <div><span className="font-semibold text-slate-700 block">Period:</span> <span className="text-slate-600">{formatDate(product.warrantyFrom)} – {formatDate(product.warrantyTo)}</span></div>
                <div><span className="font-semibold text-slate-700 block">Invoice:</span> <span className="text-slate-600">{product.invoiceNumber}</span></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Documents & Photos</h3>
            <div className="space-y-2">
              {product.installationCopyUrl ? (
                <a href={product.installationCopyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-lg font-medium transition-colors w-max">
                  <FileText className="h-4 w-4" /> View Installation Copy
                </a>
              ) : <span className="text-sm text-slate-400 italic block">No installation copy uploaded</span>}
              
              {product.invoiceCopyUrl ? (
                <a href={product.invoiceCopyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-lg font-medium transition-colors w-max">
                  <FileText className="h-4 w-4" /> View Invoice Copy
                </a>
              ) : <span className="text-sm text-slate-400 italic block">No invoice copy uploaded</span>}
            </div>

            {product.installationPhotosUrls?.length > 0 && (
              <div className="mt-4">
                <span className="font-semibold text-slate-700 text-sm block mb-2">Installation Photos ({product.installationPhotosUrls.length})</span>
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
        </div>
      </div>
    </div>
  );
}

// UI component for the user's product list.
export default function ProductList({ products }) {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = products.filter(
    (p) =>
      (p.productName.toLowerCase().includes(search.toLowerCase()) ||
       p.serialNumbers?.some(sn => sn.toLowerCase().includes(search.toLowerCase()))) &&
      (statusFilter === "all" || p.status === statusFilter)
  );

  return (
    <>
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-[#F8FAFC] dark:bg-none dark:bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-6 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              id="my-products-search"
              placeholder="Search products or serial numbers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground focus-ring transition-colors"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <select
              id="my-products-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 mb-4">
              <Package className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No products found</h3>
            <p className="mt-1 text-sm text-muted max-w-md">
              {products.length === 0 
                ? "You haven't registered any products yet."
                : "No products match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile Card View ── */}
            <div className="block sm:hidden divide-y divide-border">
              {filtered.map((p) => (
                <div key={p._id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-foreground text-sm">{p.productName}</p>
                      <p className="text-xs text-muted">Model: {p.productModel}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {formatDate(p.warrantyFrom)} – {formatDate(p.warrantyTo)}
                  </div>
                  {p.serialNumbers?.length > 0 && (
                    <p className="text-xs text-muted truncate">
                      S/N: {p.serialNumbers.join(", ")}
                    </p>
                  )}
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="mt-1 inline-flex items-center gap-1.5 self-start rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-black/5 transition-colors focus-ring min-h-[40px]"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </button>
                </div>
              ))}
            </div>

            {/* ── Desktop Table View ── */}
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
                  {filtered.map((p) => (
                    <tr
                      key={p._id}
                      className="transition-colors even:bg-black/[0.02] dark:even:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{p.productName}</div>
                        <div className="text-xs">Model: {p.productModel}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{p.serialNumbers?.join(", ")}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          <Calendar className="h-3.5 w-3.5 text-muted" />
                          {formatDate(p.warrantyFrom)} - {formatDate(p.warrantyTo)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-ring"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
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
