"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

/**
 * Helper to format date
 */
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}

/**
 * Clean Status Badge Component
 */
function StatusBadge({ status }) {
  const statusConfig = {
    Pending: { bg: "bg-orange-100", text: "text-orange-800", label: "Pending" },
    InProgress: { bg: "bg-blue-100", text: "text-blue-800", label: "In Progress" },
    Assigned: { bg: "bg-blue-100", text: "text-blue-800", label: "Assigned" },
    Approved: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Approved" },
    Resolved: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Completed" },
    Cancelled: { bg: "bg-gray-200", text: "text-gray-800", label: "Cancelled" },
    Rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
  };
  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-transform duration-300 hover:scale-105 cursor-default ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

/**
 * Horizontal Field Row Component
 */
function FieldRow({ label, value, isLast }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-between py-4 px-4 -mx-4 rounded-xl hover:bg-slate-50 transition-colors duration-300 ${!isLast ? 'border-b border-gray-100/60' : ''}`}>
      <span className="text-sm font-medium text-gray-500 sm:w-1/3 mb-1 sm:mb-0">{label}</span>
      <span className="text-sm text-gray-900 sm:w-2/3">{value}</span>
    </div>
  );
}

/**
 * Summary Row
 */
function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2.5 px-3 -mx-3 rounded-lg hover:bg-slate-50 transition-colors duration-300">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] break-words">{value}</span>
    </div>
  );
}


export default function RequestDetailsClient({ request }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const productName = request.productId?.productName || "Unknown Product";
  const productId = request.productId?._id;

  return (
    <>
      <div className="mx-auto max-w-6xl pb-16 px-4 sm:px-6 lg:px-8 pt-8 font-sans bg-gray-50 min-h-screen">
        
        {/* Navigation */}
        <Link
          href="/dashboard/requests"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 mb-6 transition-colors duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Requests
        </Link>

        {/* 1. PAGE HEADER */}
        <div className="mb-8 border-b border-gray-200 pb-5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Request Details</h1>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-gray-500">
                <span>Request ID: <span className="font-mono">#{request._id}</span></span>
              </div>
            </div>
            <div className="shrink-0 mt-1 sm:mt-0">
              <StatusBadge status={request.status} />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (70%) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1: Product Information */}
            <div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/20 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationFillMode: "both", animationDelay: "100ms", animationDuration: "500ms" }}
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Product Information</h2>
              </div>
              <div className="px-6 pb-2">
                <FieldRow 
                  label="Product Name" 
                  value={
                    productId ? (
                      <Link href={`/dashboard/products/${productId}`} className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-300 hover:underline underline-offset-2">
                        {productName}
                      </Link>
                    ) : (
                      <span className="font-semibold text-gray-900">{productName}</span>
                    )
                  } 
                />
                <FieldRow label="Request Date" value={formatDate(request.createdAt)} />
                <FieldRow label="Contact Number" value={request.contactNumber} />
                <FieldRow label="Contact Person Number" value={request.contactPersonNumber} />
                <FieldRow label="Alternative Number" value={request.alternativeNumber || "—"} isLast={true} />
              </div>
            </div>

            {/* Section 2: Problem Description */}
            <div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/20 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationFillMode: "both", animationDelay: "200ms", animationDuration: "500ms" }}
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Problem Description</h2>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-sm">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {request.problemDescription || "No description provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Uploaded Images */}
            {request.problemImages?.length > 0 && (
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/20 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationFillMode: "both", animationDelay: "300ms", animationDuration: "500ms" }}
              >
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Uploaded Images</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {request.problemImages.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(url)}
                        className="group relative aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer w-full"
                      >
                        <Image
                          src={url}
                          alt={`Problem Image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors duration-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (30%) */}
          <div className="lg:col-span-4">
            {/* Sticky Summary Panel */}
            <div 
              className="sticky top-8 space-y-6 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationFillMode: "both", animationDelay: "150ms", animationDuration: "500ms" }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/20">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                  <h2 className="text-base font-semibold text-gray-900">Summary</h2>
                </div>
                <div className="p-5 flex flex-col gap-1">
                  <SummaryRow label="Status" value={<span className="capitalize">{request.status.replace(/([A-Z])/g, ' $1').trim()}</span>} />
                  <SummaryRow label="Request Date" value={formatDate(request.createdAt)} />
                  <SummaryRow label="Product Name" value={productName} />
                  <SummaryRow label="Request ID" value={<span className="font-mono text-xs">{request._id}</span>} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/90 p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-all duration-300 z-50 hover:scale-110 hover:rotate-90"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <Image
                src={selectedImage}
                alt="Enlarged Problem Photo"
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
