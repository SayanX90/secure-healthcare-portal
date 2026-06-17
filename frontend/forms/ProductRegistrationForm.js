"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Hash, FileText, X, CheckCircle2, ArrowRight } from "lucide-react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ALLOWED_IMG_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
// These are simple reusable UI pieces kept in the same file to make it easy to read.

function InputField({ label, error, required, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        {...props}
        className={`w-full min-h-[44px] rounded-lg border ${error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/30 dark:bg-red-500/10 dark:border-red-500/50"
          : "border-border focus:border-primary focus:ring-primary bg-background"
          } px-4 py-3 text-sm text-foreground placeholder:text-muted/70 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2`}
      />
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
    </div>
  );
}

function TextAreaField({ label, error, required, rows = 3, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        rows={rows}
        {...props}
        className={`w-full min-h-[44px] rounded-lg border ${error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/30 dark:bg-red-500/10 dark:border-red-500/50"
          : "border-border focus:border-primary focus:ring-primary bg-background"
          } px-4 py-3 text-sm text-foreground placeholder:text-muted/70 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 resize-y`}
      />
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
    </div>
  );
}

function FileUploadBox({ label, accept, multiple, value, onChange, onRemove, error }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Make sure files is always an array
  const files = Array.isArray(value) ? value : value ? [value] : [];

  function handleFiles(e) {
    const selectedFiles = Array.from(e.target.files || e.dataTransfer.files);
    if (multiple) {
      onChange(selectedFiles);
    } else {
      onChange(selectedFiles[0] || null);
    }
    // Clear the input so you can upload the same file again if needed
    if (e.target) e.target.value = "";
  }

  const isImage = (file) => file?.type?.startsWith("image/");

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted mb-2">{label}</label>

      {/* Drag & Drop Area */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter") fileInputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e);
        }}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 transition-colors text-center select-none ${error
          ? "border-red-300 bg-red-50/40 dark:bg-red-500/10 dark:border-red-500/50"
          : isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
          }`}
      >
        <p className="text-sm font-medium text-foreground">Choose files or drag &amp; drop</p>
        <p className="text-xs text-muted">PDF, JPG, PNG or WEBP · Max 10 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                {isImage(file) ? (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-background">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      width={40}
                      height={40}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                )}
                <div className="truncate">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="ml-2 shrink-0 rounded-full p-1 text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Error Message */}
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function SuccessModal({ isOpen, onRegisterAnother, onGoToProducts }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl p-8 text-center border border-border">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-500/10">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
        <p className="text-muted mb-8 text-sm leading-relaxed">
          Your product has been registered. Our team will review and approve your warranty shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRegisterAnother}
            className="flex-1 w-full sm:w-auto px-4 py-3 min-h-[44px] rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Register Another
          </button>
          <button
            onClick={onGoToProducts}
            className="flex-1 w-full sm:w-auto px-4 py-3 min-h-[44px] rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            View My Products <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN FORM COMPONENT ──────────────────────────────────────────────────────
export default function ProductRegistrationForm() {
  const router = useRouter();

  // Simple UI state
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All text inputs are stored here
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    salesPerson: "",
    productName: "",
    model: "",
    quantity: 1,
    invoiceNumber: "",
    suppliedBy: "",
    installedBy: "",
    warrantyFrom: "",
    warrantyTo: "",
    remarks: "",
  });

  // All text input errors are stored here
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState({});

  // Serial numbers are stored in a simple array
  const [serialNumbers, setSerialNumbers] = useState([""]);
  const [serialNumberErrors, setSerialNumberErrors] = useState([]);

  // All file uploads are stored here
  const [files, setFiles] = useState({
    installationCopy: null,
    invoiceCopy: null,
    installationPhotos: [],
  });

  // Watch the quantity field. If it changes, we update the number of serial number boxes.
  useEffect(() => {
    // Make sure quantity is at least 1
    const qty = Math.max(1, parseInt(formData.quantity, 10) || 1);

    setSerialNumbers((prev) => {
      // If we already have the right amount, do nothing
      if (prev.length === qty) return prev;
      // If we need more, add empty strings
      if (prev.length < qty) return [...prev, ...Array(qty - prev.length).fill("")];
      // If we need less, slice the array
      return prev.slice(0, qty);
    });

    // Clear serial number errors when quantity changes
    setSerialNumberErrors([]);
  }, [formData.quantity]);

  // Standard React input change handler
  function handleChange(e) {
    const { name, value } = e.target;

    // Update the form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If there was an error for this field, clear it so the user sees it's fixed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // Handle changes specifically for the serial number array
  function handleSerialNumberChange(index, value) {
    // Update the specific serial number
    setSerialNumbers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    // Clear the error for that specific serial number box
    setSerialNumberErrors((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });
  }

  // Helper function to check if a single file is valid
  function checkFileValidity(file, allowedTypes, label) {
    if (!file) return null;
    if (file.size > MAX_FILE_BYTES) return `${label} is too big. Max size is 10 MB.`;
    if (!allowedTypes.includes(file.type)) return `${label} must be a PDF, JPG, PNG, or WEBP file.`;
    return null;
  }

  // Check if text inputs are filled out correctly using simple if statements
  function validateForm() {
    const newErrors = {};

    if (formData.customerName.trim() === "") {
      newErrors.customerName = { message: "Customer name is required" };
    }
    if (formData.address.trim() === "") {
      newErrors.address = { message: "Address is required" };
    }
    if (formData.productName.trim() === "") {
      newErrors.productName = { message: "Product name is required" };
    }
    if (formData.model.trim() === "") {
      newErrors.model = { message: "Model is required" };
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = { message: "Quantity must be at least 1" };
    }

    if (formData.invoiceNumber.trim() === "") {
      newErrors.invoiceNumber = { message: "Invoice number is required" };
    }
    if (formData.warrantyFrom === "") {
      newErrors.warrantyFrom = { message: "Warranty start date is required" };
    }
    if (formData.warrantyTo === "") {
      newErrors.warrantyTo = { message: "Warranty end date is required" };
    }

    // Check if end date is before start date
    if (formData.warrantyFrom !== "" && formData.warrantyTo !== "") {
      const startDate = new Date(formData.warrantyFrom);
      const endDate = new Date(formData.warrantyTo);

      if (endDate <= startDate) {
        newErrors.warrantyTo = { message: "End date must be after start date" };
      }
    }

    setErrors(newErrors);

    // Return true if there are zero errors
    return Object.keys(newErrors).length === 0;
  }

  // Check if all serial numbers are filled out
  function validateSerialNumbers() {
    let hasError = false;
    const errs = [];

    for (let i = 0; i < serialNumbers.length; i++) {
      if (serialNumbers[i].trim() === "") {
        errs[i] = "This field is required";
        hasError = true;
      } else {
        errs[i] = "";
      }
    }

    setSerialNumberErrors(errs);
    return !hasError;
  }

  // Check if all uploaded files are valid
  function validateFiles() {
    const errs = {};

    // Check installation copy
    if (!files.installationCopy) {
      errs.installationCopy = "Installation copy is required";
    } else {
      const e = checkFileValidity(files.installationCopy, ALLOWED_DOC_TYPES, "Installation copy");
      if (e) errs.installationCopy = e;
    }

    // Check invoice copy
    if (!files.invoiceCopy) {
      errs.invoiceCopy = "Invoice copy is required";
    } else {
      const e = checkFileValidity(files.invoiceCopy, ALLOWED_DOC_TYPES, "Invoice copy");
      if (e) errs.invoiceCopy = e;
    }

    // Check installation photos (optional, but if provided they must be images)
    for (let i = 0; i < files.installationPhotos.length; i++) {
      const photo = files.installationPhotos[i];
      const e = checkFileValidity(photo, ALLOWED_IMG_TYPES, photo.name);
      if (e) {
        errs.installationPhotos = e;
        break; // Stop checking after first error
      }
    }

    return errs;
  }

  // Handle form submission
  async function handleSubmit(e) {
    if (e) e.preventDefault();

    // 1. Run validations
    const isFormValid = validateForm();
    const isSerialValid = validateSerialNumbers();
    const fileErrs = validateFiles();

    // 2. Show error messages if anything failed
    if (!isFormValid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const qty = parseInt(formData.quantity, 10);
    if (serialNumbers.length !== qty) {
      toast.error(`You must enter ${qty} serial number(s).`);
      return;
    }

    if (!isSerialValid) {
      toast.error("Please fill in all serial number fields.");
      return;
    }

    if (Object.keys(fileErrs).length > 0) {
      setFileErrors(fileErrs);
      toast.error("Please fix the file upload errors.");
      return;
    }

    // 3. Clear file errors and start submission
    setFileErrors({});
    setIsSubmitting(true);

    // ── STEP 1: Upload files to Cloudinary ──
    const uploadToastId = toast.loading("Uploading files...");
    let uploadedUrls;

    try {
      const fileBody = new FormData();
      fileBody.append("productName", formData.productName);
      fileBody.append("installationCopy", files.installationCopy);
      fileBody.append("invoiceCopy", files.invoiceCopy);

      files.installationPhotos.forEach((photo) => {
        fileBody.append("installationPhotos", photo);
      });

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fileBody
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "File upload failed");
      }

      toast.success("Files uploaded!", { id: uploadToastId });
      uploadedUrls = uploadData.urls;

    } catch (err) {
      toast.error(err.message || "Upload failed.", { id: uploadToastId });
      setIsSubmitting(false);
      return;
    }

    // ── STEP 2: Submit all data to our database ──
    const submitToastId = toast.loading("Submitting registration...");

    try {
      const payload = {
        customerName: formData.customerName,
        customerAddress: formData.address,
        productName: formData.productName,
        productModel: formData.model,
        quantity: formData.quantity,
        serialNumbers: serialNumbers.map((s) => s.trim()),
        invoiceNumber: formData.invoiceNumber,
        suppliedBy: formData.suppliedBy || "",
        installedBy: formData.installedBy || "",
        warrantyFrom: formData.warrantyFrom,
        warrantyTo: formData.warrantyTo,
        salesPerson: formData.salesPerson || "",
        remarks: formData.remarks || "",
        installationCopyUrl: uploadedUrls.installationCopyUrl,
        invoiceCopyUrl: uploadedUrls.invoiceCopyUrl,
        installationPhotosUrls: uploadedUrls.installationPhotosUrls,
      };

      const registerRes = await fetch("/api/products/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(registerData.message || "Registration failed");
      }

      // Success!
      toast.success("Product registered successfully!", { id: submitToastId });
      setShowSuccess(true);

    } catch (err) {
      toast.error(err.message || "Registration failed.", { id: submitToastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Clear everything so the user can register another product
  function handleRegisterAnother() {
    setFormData({
      customerName: "", address: "", salesPerson: "",
      productName: "", model: "", quantity: 1,
      invoiceNumber: "", suppliedBy: "", installedBy: "",
      warrantyFrom: "", warrantyTo: "", remarks: "",
    });
    setFiles({ installationCopy: null, invoiceCopy: null, installationPhotos: [] });
    setErrors({});
    setFileErrors({});
    setSerialNumbers([""]);
    setSerialNumberErrors([]);
    setShowSuccess(false);

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleGoToProducts() {
    router.push("/dashboard/products");
  }

  return (
    <>
      <SuccessModal
        isOpen={showSuccess}
        onRegisterAnother={handleRegisterAnother}
        onGoToProducts={handleGoToProducts}
      />

      <div className="bg-background min-h-screen pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Register Product</h1>
            <p className="text-sm text-muted mt-1">Enter product and warranty details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>

            {/* SECTION 1: Customer */}
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border p-6 sm:p-8">
              <h2 className="text-base font-semibold text-foreground mb-6 border-b border-border pb-3">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Customer Name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Full name or company"
                  error={errors.customerName}
                />
                <InputField
                  label="Sales Person"
                  name="salesPerson"
                  value={formData.salesPerson}
                  onChange={handleChange}
                  placeholder="Optional"
                  error={errors.salesPerson}
                />
                <div className="md:col-span-2">
                  <TextAreaField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Complete installation address"
                    error={errors.address}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Product */}
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border p-6 sm:p-8">
              <h2 className="text-base font-semibold text-foreground mb-6 border-b border-border pb-3">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Product Name"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Inverter AC"
                  error={errors.productName}
                />
                <InputField
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="Model number"
                  error={errors.model}
                />
                <InputField
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  type="number"
                  min="1"
                  error={errors.quantity}
                />
                <InputField
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  required
                  placeholder="INV-2024-001"
                  error={errors.invoiceNumber}
                />
                <InputField
                  label="Supplied By"
                  name="suppliedBy"
                  value={formData.suppliedBy}
                  onChange={handleChange}
                  placeholder="Supplier name (optional)"
                  error={errors.suppliedBy}
                />
                <InputField
                  label="Installed By"
                  name="installedBy"
                  value={formData.installedBy}
                  onChange={handleChange}
                  placeholder="Installer name (optional)"
                  error={errors.installedBy}
                />
              </div>

              {/* Dynamic Serial Number Inputs */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-4 w-4 text-muted" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Serial Numbers
                    <span className="text-red-500 ml-0.5">*</span>
                    <span className="ml-2 text-xs font-normal text-muted">
                      ({serialNumbers.length} of {Math.max(1, parseInt(formData.quantity, 10) || 1)} required)
                    </span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serialNumbers.map((serialNum, index) => (
                    <div key={index} className="w-full">
                      <label className="block text-sm font-medium text-muted mb-1.5">
                        Serial Number {index + 1} <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={serialNum}
                        onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                        placeholder={`Serial number ${index + 1}`}
                        className={`w-full min-h-[44px] rounded-lg border ${serialNumberErrors[index]
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/30 dark:bg-red-500/10 dark:border-red-500/50"
                          : "border-border focus:border-primary focus:ring-primary bg-background"
                          } px-4 py-3 text-sm text-foreground placeholder:text-muted/70 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2`}
                      />
                      {serialNumberErrors[index] && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{serialNumberErrors[index]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: Warranty */}
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border p-6 sm:p-8">
              <h2 className="text-base font-semibold text-foreground mb-6 border-b border-border pb-3">Warranty Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Warranty From"
                  name="warrantyFrom"
                  value={formData.warrantyFrom}
                  onChange={handleChange}
                  type="date"
                  required
                  error={errors.warrantyFrom}
                />
                <InputField
                  label="Warranty To"
                  name="warrantyTo"
                  value={formData.warrantyTo}
                  onChange={handleChange}
                  type="date"
                  required
                  error={errors.warrantyTo}
                />
              </div>
            </div>

            {/* SECTION 4: Uploads */}
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border p-6 sm:p-8">
              <h2 className="text-base font-semibold text-foreground mb-6 border-b border-border pb-3">Upload Documents</h2>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadBox
                    label="Installation Copy *"
                    accept=".pdf,image/*"
                    error={fileErrors.installationCopy}
                    value={files.installationCopy}
                    onChange={(file) => {
                      setFiles(prev => ({ ...prev, installationCopy: file }));
                      setFileErrors(prev => ({ ...prev, installationCopy: null }));
                    }}
                    onRemove={() => setFiles(prev => ({ ...prev, installationCopy: null }))}
                  />
                  <FileUploadBox
                    label="Invoice Copy *"
                    accept=".pdf,image/*"
                    error={fileErrors.invoiceCopy}
                    value={files.invoiceCopy}
                    onChange={(file) => {
                      setFiles(prev => ({ ...prev, invoiceCopy: file }));
                      setFileErrors(prev => ({ ...prev, invoiceCopy: null }));
                    }}
                    onRemove={() => setFiles(prev => ({ ...prev, invoiceCopy: null }))}
                  />
                </div>
                <FileUploadBox
                  label="Installation Photos (multiple allowed)"
                  accept="image/*"
                  multiple
                  error={fileErrors.installationPhotos}
                  value={files.installationPhotos}
                  onChange={(newFiles) => {
                    setFiles(prev => ({
                      ...prev,
                      installationPhotos: Array.isArray(newFiles) ? newFiles : [newFiles]
                    }));
                    setFileErrors(prev => ({ ...prev, installationPhotos: null }));
                  }}
                  onRemove={(indexToRemove) => {
                    setFiles(prev => ({
                      ...prev,
                      installationPhotos: prev.installationPhotos.filter((_, index) => index !== indexToRemove)
                    }));
                  }}
                />
              </div>
            </div>

            {/* SECTION 5: Remarks */}
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border p-6 sm:p-8">
              <h2 className="text-base font-semibold text-foreground mb-6 border-b border-border pb-3">Additional Notes</h2>
              <TextAreaField
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any additional notes or comments..."
                error={errors.remarks}
              />
            </div>

          </form>
        </div>

        {/* STICKY BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-6 py-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-5xl mx-auto flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] flex items-center justify-center rounded-lg border border-border text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-2.5 min-h-[44px] rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                "Submit Registration"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
