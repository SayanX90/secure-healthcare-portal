"use client";

import { CheckCircle2, Clock, X, Calendar, Eye } from "lucide-react";


// Exported so ProductsTable can use it inside ProductModal.
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

// StatusBadge: shows a colored label based on product approval status.
// Exported so ProductsTable can use it inside ProductModal.
export function StatusBadge({ status }) {
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

// ProductRow: renders a single <tr> in the admin products table.
// Props:
//   product — the product object from the database
//   onView  — called with the product object when the View button is clicked
export default function ProductRow({ product, onView }) {
  return (
    <tr className="transition-colors even:bg-black/[0.02] dark:even:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 group">

      {/* Customer name + product name + quantity */}
      <td className="px-6 py-4">
        <div className="font-bold text-foreground">{product.customerName}</div>
        <div className="text-xs text-muted">{product.productName} ({product.quantity}x)</div>
      </td>

      {/* Serial numbers + invoice number */}
      <td className="px-6 py-4">
        <div className="font-medium text-foreground">{product.serialNumbers?.join(", ")}</div>
        <div className="text-xs text-muted">Inv: {product.invoiceNumber}</div>
      </td>

      {/* Warranty date range */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-foreground">
          <Calendar className="h-3.5 w-3.5 text-muted" />
          {formatDate(product.warrantyFrom)} - {formatDate(product.warrantyTo)}
        </div>
      </td>

      {/* Approval status badge */}
      <td className="px-6 py-4">
        <StatusBadge status={product.status} />
      </td>

      {/* View button — opens the product detail modal */}
      <td className="px-6 py-4">
        <button
          onClick={() => onView(product)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-ring"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      </td>
    </tr>
  );
}
