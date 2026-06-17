"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  ShieldCheck,
  FileText,
  ImageIcon,
  Wrench,
  Clock,
  CheckCircle2,
  X,
  ArrowLeft,
  Calendar,
  MessageSquare,
} from "lucide-react";

// IMPORTANT: We import the BookServiceModal from its brand new, dedicated file!
import BookServiceModal from "./BookServiceModal";


/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * formatDate: Takes a raw date string from MongoDB and makes it human-readable.
 * Example: "May 31, 2026"
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
 * StatusBadge: Shows a small pill (green/red/yellow) indicating if a product is approved.
 */
function StatusBadge({ status, className = "" }) {
  if (status === "approved") {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-300/50 bg-emerald-100/80 backdrop-blur-sm px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm ${className}`}>
        <CheckCircle2 className="h-4 w-4" /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-red-300/50 bg-red-100/80 backdrop-blur-sm px-3 py-1 text-xs font-bold text-red-800 shadow-sm ${className}`}>
        <X className="h-4 w-4" /> Rejected
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-100/80 backdrop-blur-sm px-3 py-1 text-xs font-bold text-amber-800 shadow-sm ${className}`}>
      <Clock className="h-4 w-4" /> Pending
    </span>
  );
}




/**
 * ============================================================================
 * LAYOUT COMPONENTS (To make the code cleaner)
 * ============================================================================
 */

/**
 * PremiumCard: A wrapper component that gives a beautiful glass-like white box
 * with a subtle gradient background and shadow. Used for the 4 main sections.
 */
function PremiumCard({ icon: Icon, iconColor, title, children, delay = "0", statusBorder = null }) {
  let borderClass = "border border-white/60";
  if (statusBorder === "pending") borderClass = "border border-white/60 border-l-4 border-l-orange-400";
  else if (statusBorder === "approved") borderClass = "border border-white/60 border-l-4 border-l-emerald-400";
  else if (statusBorder === "rejected") borderClass = "border border-white/60 border-l-4 border-l-red-400";

  return (
    <div className={`relative overflow-hidden rounded-3xl ${borderClass} bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 fill-mode-both`} style={{ animationDelay: `${delay}ms`, animationDuration: '700ms' }}>
      {/* Decorative blurry color splash in the background corner */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-100/40 to-violet-100/40 blur-3xl -z-10" />

      {/* Card Header (Icon + Title) */}
      <div className="flex items-center gap-4 border-b border-slate-200/50 px-6 sm:px-8 py-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconColor} shadow-inner`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</h3>
      </div>

      {/* Card Body (Where the actual content goes) */}
      <div className="p-6 sm:px-8 sm:py-7">{children}</div>
    </div>
  );
}

/**
 * PremiumInfoRow: A simple row component used inside the cards to show
 * a label on the left (e.g. "Model") and a value on the right.
 */
function PremiumInfoRow({ label, value, isLast = false }) {
  return (
    <div className={`group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3.5 px-3 -mx-3 rounded-xl hover:bg-slate-50/80 transition-colors ${!isLast ? 'border-b border-slate-100/60' : ''}`}>
      <span className="text-sm font-bold text-slate-400 sm:w-1/3 shrink-0 tracking-wide uppercase text-xs">{label}</span>
      <span className="text-sm sm:text-base text-slate-800 font-semibold">{value || "—"}</span>
    </div>
  );
}


/**
 * ============================================================================
 * MAIN COMPONENT: PRODUCT DETAILS PAGE
 * ============================================================================
 * It is called a "Client Component" because it has interactivity (the Book Service button).
 */
export default function ProductDetailsClient({ product }) {

  // 1. STATE VARIABLES
  // This boolean remembers whether the Book Service modal is open or closed.
  const [showBookService, setShowBookService] = useState(false);
  // Modal for viewing installation images
  const [selectedImage, setSelectedImage] = useState(null);



  // 2. RENDER UI
  return (
    <>
      {/* 
        This is our separated Modal component!
        We pass it the product info, and it handles the rest. 
      */}
      <BookServiceModal
        product={product}
        isOpen={showBookService}
        onClose={() => setShowBookService(false)} // Called when the user clicks 'X' or submits
      />

      <div className="mx-auto max-w-6xl pb-12">

        {/* --- Navigation Bar & Top Actions --- */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/dashboard/products"
            className="group inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to My Products
          </Link>

          {/* Right Top Action: CTA */}
          <div className="flex flex-col items-end">
            <button
              onClick={() => setShowBookService(true)} // Opens the modal!
              className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden"
            >
              {/* A shiny shimmer effect that runs when you hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <Wrench className="h-4 w-4" />
              Book Service Now
            </button>
            <p className="text-xs text-slate-500 mt-2 font-medium">Book a service request.</p>
          </div>
        </div>


        {/* --- Main Grid Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Takes up 7 out of 12 slots on large screens */}
          <div className="lg:col-span-7 space-y-8">

            {/* Section 1: Product Information */}
            <PremiumCard icon={Package} iconColor="bg-indigo-100 text-indigo-600" title="Product Information" delay="100" statusBorder={product.status}>
              <PremiumInfoRow label="Product Name" value={product.productName} />
              <PremiumInfoRow label="Model" value={product.productModel} />
              <PremiumInfoRow label="Registration Date" value={formatDate(product.createdAt)} />
              <PremiumInfoRow label="Status" value={<StatusBadge status={product.status} />} />
              <PremiumInfoRow label="Quantity" value={product.quantity} />
              <PremiumInfoRow label="Serial Numbers" value={product.serialNumbers?.join(", ")} />
              <PremiumInfoRow label="Customer Name" value={product.customerName} />
              <PremiumInfoRow label="Address" value={product.customerAddress} isLast={true} />
            </PremiumCard>

            {/* Section 2: Warranty & Status */}
            <PremiumCard icon={ShieldCheck} iconColor="bg-emerald-100 text-emerald-600" title="Warranty Details" delay="200">
              <PremiumInfoRow label="Warranty Period" value={`${formatDate(product.warrantyFrom)} – ${formatDate(product.warrantyTo)}`} />
              <PremiumInfoRow label="Invoice Number" value={product.invoiceNumber} />
              {product.suppliedBy && <PremiumInfoRow label="Supplied By" value={product.suppliedBy} />}
              {product.installedBy && <PremiumInfoRow label="Installed By" value={product.installedBy} />}
              {product.salesPerson && <PremiumInfoRow label="Sales Person" value={product.salesPerson} isLast={true} />}
            </PremiumCard>



          </div>


          {/* RIGHT COLUMN: Takes up 5 out of 12 slots on large screens */}
          <div className="lg:col-span-5 space-y-8">

            {/* Section 3: Documents & Media */}
            <PremiumCard icon={FileText} iconColor="bg-violet-100 text-violet-600" title="Documents & Media" delay="300">
              <div className="space-y-6">

                {/* 3A: Clickable tiles for PDF Documents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Tile for Installation Copy */}
                  {product.installationCopyUrl ? (
                    <a href={product.installationCopyUrl} target="_blank" rel="noreferrer" className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all text-center relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">PDF</div>
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FileText className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Installation Copy</span>
                    </a>
                  ) : (
                    // What to show if no copy was uploaded
                    <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center opacity-70">
                      <FileText className="h-12 w-12 text-slate-300 mb-3" />
                      <span className="text-sm font-bold text-slate-400">No Install Copy</span>
                    </div>
                  )}

                  {/* Tile for Invoice Copy */}
                  {product.invoiceCopyUrl ? (
                    <a href={product.invoiceCopyUrl} target="_blank" rel="noreferrer" className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all text-center relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">PDF</div>
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FileText className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Invoice Copy</span>
                    </a>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center opacity-70">
                      <FileText className="h-12 w-12 text-slate-300 mb-3" />
                      <span className="text-sm font-bold text-slate-400">No Invoice Copy</span>
                    </div>
                  )}
                </div>

                {/* 3B: Gallery for Installation Photos */}
                {product.installationPhotosUrls?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Installation Photos</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {product.installationPhotosUrls.map((url, index) => (
                        <button 
                          key={index} 
                          onClick={() => setSelectedImage(url)} 
                          className="relative aspect-square rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-200 hover:border-indigo-300"
                        >
                          <Image
                            src={url}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 drop-shadow-md" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3C: Remarks / Comments block */}
                {product.remarks && (
                  <div>
                    <div className="bg-amber-50/80 border border-amber-200/60 p-5 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-amber-800">
                        <MessageSquare className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wide">Technician Remarks</h4>
                      </div>
                      <div className="text-sm font-medium text-amber-900/80 italic leading-relaxed">
                        &quot;{product.remarks}&quot;
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </PremiumCard>

          </div>
        </div>

      </div>

      {/* Lightbox Modal for Images */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex flex-col items-center justify-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 sm:-right-12 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-black/50">
              <Image
                src={selectedImage}
                alt="Enlarged Installation Photo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
