"use client";

import { useState } from "react";
import { CheckCircle2, X, Wrench, Loader2, ImagePlus } from "lucide-react";

/**
 * ============================================================================
 * BOOK SERVICE MODAL COMPONENT
 * ============================================================================
 * 
 * This component handles the popup form where a user can book a service
 * for a specific product. It handles typing in fields, selecting images,
 * and sending all that data to the backend API.
 * 
 * Props:
 * - product: The specific product the user wants to book service for.
 * - isOpen: A boolean (true/false) that controls if this modal is visible.
 * - onClose: A function to call when we want to hide/close the modal.
 */
export default function BookServiceModal({ product, isOpen, onClose }) {
  // ------------------------------------------------------------------------
  // 1. STATE VARIABLES
  // ------------------------------------------------------------------------
  // These variables remember what the user types into the form.
  const [contactNumber, setContactNumber] = useState("");
  const [contactPersonNumber, setContactPersonNumber] = useState("");
  const [alternativeNumber, setAlternativeNumber] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  // These remember the image files the user has chosen from their computer.
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // These remember the current "status" of the form (e.g. is it loading? is there an error?)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // ------------------------------------------------------------------------
  // 2. EARLY EXIT
  // ------------------------------------------------------------------------
  // If `isOpen` is false, or we don't have a `product`, return `null` 
  // which tells React not to draw anything on the screen.
  if (!isOpen || !product) return null;

  // ------------------------------------------------------------------------
  // 3. HELPER FUNCTIONS
  // ------------------------------------------------------------------------

  /**
   * handleInputChange: Called every time the user types in a text box.
   * It clears any error messages and updates the correct state variable.
   */
  function handleInputChange(fieldName, value) {
    setErrorMessage(""); // clear errors when user starts typing

    // ----------------------------------------------------
    // 1. Handle Contact Number
    // ----------------------------------------------------
    if (fieldName === "contactNumber") {
      const numbersOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
      setContactNumber(numbersOnly);
    }

    // ----------------------------------------------------
    // 2. Handle Contact Person Number
    // ----------------------------------------------------
    else if (fieldName === "contactPersonNumber") {
      const numbersOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
      setContactPersonNumber(numbersOnly);
    }

    // ----------------------------------------------------
    // 3. Handle Alternative Number
    // ----------------------------------------------------
    else if (fieldName === "alternativeNumber") {
      const numbersOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
      setAlternativeNumber(numbersOnly);
    }

    // ----------------------------------------------------
    // 4. Handle Problem Description
    // ----------------------------------------------------
    else if (fieldName === "problemDescription") {
      setProblemDescription(value);
    }
  }

  /**
   * handleImageSelect: Called when the user selects files using the file picker.
   * It stores the files and creates tiny temporary image URLs so we can preview them.
   */
  function handleImageSelect(event) {
    // Convert the FileList object to a normal JavaScript array
    const newFiles = Array.from(event.target.files);

    // Add the newly selected files to our existing state
    setImageFiles([...imageFiles, ...newFiles]);

    // For each file, create a preview URL
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [
          ...prev,
          { name: file.name, url: e.target.result },
        ]);
      };
      reader.readAsDataURL(file); // This triggers the `onload` above when finished
    });
  }

  /**
   * handleRemoveImage: Called when user clicks the "X" on an image preview.
   * Removes that specific image from our state arrays.
   */
  function handleRemoveImage(index) {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  }

  /**
   * handleClose: Resets all the form fields back to empty and calls the parent's onClose.
   */
  function handleClose() {
    setContactNumber("");
    setContactPersonNumber("");
    setAlternativeNumber("");
    setProblemDescription("");
    setImageFiles([]);
    setImagePreviews([]);
    setErrorMessage("");
    setIsSuccess(false);
    onClose();
  }

  /**
   * handleSubmit: Called when the user clicks the "Submit" button.
   * Sends the form data to our backend API.
   */
  async function handleSubmit(event) {
    event.preventDefault(); // Prevents the browser from refreshing the page
    setErrorMessage("");

    // --- Validation: Strict rules for all fields ---
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(contactNumber.trim())) {
      setErrorMessage("Contact number must be exactly 10 digits.");
      return;
    }
    if (!phoneRegex.test(contactPersonNumber.trim())) {
      setErrorMessage("Contact person number must be exactly 10 digits.");
      return;
    }
    if (alternativeNumber.trim() && !phoneRegex.test(alternativeNumber.trim())) {
      setErrorMessage("Alternative number must be exactly 10 digits.");
      return;
    }
    if (imageFiles.length === 0) {
      setErrorMessage("Please upload at least one problem image.");
      return;
    }
    if (!problemDescription.trim() || problemDescription.trim().length < 10) {
      setErrorMessage("Please provide a detailed problem description.");
      return;
    }

    setIsSubmitting(true); // Turns on the loading spinner

    try {
      let uploadedImageUrls = [];

      // If the user selected images, we must upload them FIRST
      if (imageFiles.length > 0) {
        const formData = new FormData(); // A special format for sending files
        imageFiles.forEach((file) => formData.append("problemImages", file));

        // Send files to our upload API
        const uploadResponse = await fetch("/api/upload/service-images", { method: "POST", body: formData });
        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) throw new Error(uploadResult.message || "Image upload failed.");

        // Save the URLs returned by the server
        uploadedImageUrls = uploadResult.urls || [];
      }

      // After images are uploaded, send the rest of the form data to the service API
      const response = await fetch("/api/bookservice", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // We are sending JSON data
        body: JSON.stringify({
          productId: product._id,
          contactNumber: contactNumber.trim(),
          contactPersonNumber: contactPersonNumber.trim(),
          alternativeNumber: alternativeNumber.trim(),
          problemDescription: problemDescription.trim(),
          problemImages: uploadedImageUrls,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to create service request.");

      // If we got here, everything worked perfectly! Show the success screen.
      setIsSuccess(true);

      // Wait 1.8 seconds, then automatically close the modal.
      setTimeout(() => handleClose(), 1800);
    } catch (err) {
      // If anything failed along the way, show an error message
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false); // Turn off the loading spinner no matter what happened
    }
  }

  // ------------------------------------------------------------------------
  // 4. RENDER UI
  // ------------------------------------------------------------------------

  // If the submission was successful, just show a big checkmark!
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Service Request Submitted!</h3>
          <p className="text-base text-slate-500">Your request has been saved successfully. Our team will review it shortly.</p>
        </div>
      </div>
    );
  }

  // Otherwise, show the actual form
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* This is the dark background behind the modal. Clicking it closes the modal. */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      {/* This is the white modal box itself */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">

        {/* --- Header Section --- */}
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Book Service</h2>
              <p className="text-sm font-medium text-orange-600/80">{product.productName}</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-full p-2.5 bg-white/50 hover:bg-white text-slate-400 hover:text-slate-600 transition-all shadow-sm">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- Form Body Section --- */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-8 py-6 space-y-5">
          {/* Display error message if we have one */}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 font-semibold">{errorMessage}</div>
          )}

          {/* Contact Number Input */}
          <div>
            <label htmlFor="bs-contactNumber" className="block text-sm font-bold text-slate-700 mb-2">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              id="bs-contactNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
              placeholder="Enter contact number"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Contact Person Number Input */}
          <div>
            <label htmlFor="bs-contactPersonNumber" className="block text-sm font-bold text-slate-700 mb-2">
              Contact Person Number <span className="text-red-500">*</span>
            </label>
            <input
              id="bs-contactPersonNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={contactPersonNumber}
              onChange={(e) => handleInputChange("contactPersonNumber", e.target.value)}
              placeholder="Enter contact person number"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Alternative Number Input */}
          <div>
            <label htmlFor="bs-alternativeNumber" className="block text-sm font-bold text-slate-700 mb-2">
              Alternative Number <span className="text-slate-400 text-xs font-medium ml-1">(optional)</span>
            </label>
            <input
              id="bs-alternativeNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={alternativeNumber}
              onChange={(e) => handleInputChange("alternativeNumber", e.target.value)}
              placeholder="Enter alternative number"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Problem Images Uploader */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Problem Images <span className="text-slate-400 text-xs font-medium ml-1">(optional)</span>
            </label>

            {/* The clickable box to open the file picker */}
            <label htmlFor="bs-problemImages" className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
              <ImagePlus className="h-8 w-8 text-slate-400 mb-3" />
              <span className="text-sm text-slate-600 font-bold">Click to upload images</span>
              <span className="text-xs font-medium text-slate-400 mt-1">JPG, PNG, WEBP (max 10MB each)</span>

              {/* This input is hidden by Tailwind `hidden`, but clicking the `label` triggers it! */}
              <input
                id="bs-problemImages"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {/* If the user has selected images, show small previews below the box */}
            {imagePreviews.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img.url} alt={img.name} className="h-16 w-16 object-cover rounded-xl border border-slate-200 shadow-sm" />
                    {/* A small red 'X' button that appears when you hover over the image */}
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-md">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Problem Description Input (Textarea) */}
          <div>
            <label htmlFor="bs-problemDescription" className="block text-sm font-bold text-slate-700 mb-2">
              Problem Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bs-problemDescription"
              value={problemDescription}
              onChange={(e) => handleInputChange("problemDescription", e.target.value)}
              placeholder="Describe the issue you're facing with the product..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none shadow-sm"
            />
          </div>

          {/* Buttons at the bottom */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <button type="button" onClick={handleClose} disabled={isSubmitting} className="h-11 rounded-xl bg-slate-100 px-6 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-orange-600 px-8 text-sm font-bold text-white hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 inline-flex items-center gap-2 shadow-md">
              {/* If we are submitting, show a spinning loader icon instead of text */}
              {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>) : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
