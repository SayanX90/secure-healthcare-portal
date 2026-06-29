"use client";
// ProfileForm.js — A form to create or edit a user's profile.

// ──────────────────────────────────────────────────────────────────────────────

import { useState, useRef } from "react";

// Reusable UI components from our project
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import Alert from "@/ui/Alert";

// ─── The Component ───────────────────────────────────────────────────────────
// Props:
//   • user  — existing user data (used to pre-fill the form when editing)
//   • mode  — "create" (first time) or "edit" (updating existing profile)
// ──────────────────────────────────────────────────────────────────────────────

// Simple email regex — good enough for frontend validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileForm({ user, mode = "create" }) {


  const [formData, setFormData] = useState({
    name: user?.name === "User" ? "" : user?.name || "",
    gender: user?.gender || "",
    age: user?.age || "",
    personalEmail: user?.personalEmail || "",
    designation: user?.designation || "",
    organizationName: user?.organizationName || "",
    organizationEmail: user?.organizationEmail || "",
    organizationPhone: user?.organizationPhone || "",
    organizationAddress: user?.organizationAddress || "",
  });

  // Per-field validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Error message shown at the top of the form
  const [error, setError] = useState("");

  // Loading spinner on the submit button while saving
  const [loading, setLoading] = useState(false);

  // Refs for each field so we can scroll/focus the first invalid one
  const fieldRefs = {
    name: useRef(null),
    gender: useRef(null),
    age: useRef(null),
    personalEmail: useRef(null),
    designation: useRef(null),
    organizationName: useRef(null),
    organizationEmail: useRef(null),
    organizationPhone: useRef(null),
    organizationAddress: useRef(null),
  };

  function handleChange(e) {
    const fieldName = e.target.name;
    let fieldValue = e.target.value;

    // Organization Phone: allow only digits, max 10
    if (fieldName === "organizationPhone") {
      fieldValue = fieldValue.replace(/\D/g, "").slice(0, 10);
    }

    // Copy all old values, but overwrite the one that changed
    setFormData(function (oldData) {
      return { ...oldData, [fieldName]: fieldValue };
    });

    // Clear error for this field as user types
    setFieldErrors(function (oldErrors) {
      if (!oldErrors[fieldName]) return oldErrors;
      const copy = { ...oldErrors };
      delete copy[fieldName];
      return copy;
    });
  }

  // ── Validation ────────────────────────────────────────────────────────────
  // Returns an object of { fieldName: "error message" }.
  // Empty object = everything is valid.

  function validate() {
    const errors = {};

    // --- Required text fields ---
    if (!formData.name.trim()) {
      errors.name = "Full Name is required.";
    }

    if (!formData.gender) {
      errors.gender = "Gender is required.";
    }

    // Age: required + must be a valid number
    if (!String(formData.age).trim()) {
      errors.age = "Age is required.";
    } else {
      const ageNum = Number(formData.age);
      if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120 || !Number.isInteger(ageNum)) {
        errors.age = "Please enter a valid age (0–120).";
      }
    }

    // Personal Email: required + valid format
    if (!formData.personalEmail.trim()) {
      errors.personalEmail = "Personal Email is required.";
    } else if (!EMAIL_REGEX.test(formData.personalEmail.trim())) {
      errors.personalEmail = "Please enter a valid email address.";
    }

    if (!formData.designation.trim()) {
      errors.designation = "Designation is required.";
    }

    if (!formData.organizationName.trim()) {
      errors.organizationName = "Organization Name is required.";
    }

    // Organization Email: required + valid format
    if (!formData.organizationEmail.trim()) {
      errors.organizationEmail = "Organization Email is required.";
    } else if (!EMAIL_REGEX.test(formData.organizationEmail.trim())) {
      errors.organizationEmail = "Please enter a valid email address.";
    }

    // Organization Phone: required + exactly 10 digits
    if (!formData.organizationPhone.trim()) {
      errors.organizationPhone = "Organization Phone is required.";
    } else if (!/^\d{10}$/.test(formData.organizationPhone.trim())) {
      errors.organizationPhone = "Organization Phone must contain exactly 10 digits.";
    }

    if (!formData.organizationAddress.trim()) {
      errors.organizationAddress = "Organization Address is required.";
    }

    return errors;
  }

  // ── Step 3: Handle form submission ───────────────────────────────────────
  // Runs when the user clicks the submit button.

  async function handleSubmit(e) {
    // Prevent the browser from reloading the page (default form behavior)
    e.preventDefault();

    // Clear any previous error
    setError("");

    // --- Run field-level validation ---
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to & focus the first invalid field
      const firstErrorField = Object.keys(errors)[0];
      const ref = fieldRefs[firstErrorField];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.current.focus({ preventScroll: true });
      }
      return; // Stop here, don't send to server
    }

    // --- Send data to the server ---
    setLoading(true); // Show spinner on button

    try {
      // Pick the right API endpoint based on create vs edit mode
      const url =
        mode === "create"
          ? "/api/user/create-profile"
          : "/api/user/update-profile";

      // fetch() sends data to our Next.js API route
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Convert JS object → JSON string
      });

      // Parse the JSON the server sent back
      const data = await response.json();

      // If the server returned an error status (4xx or 5xx)
      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      // ✅ Success! Hard-navigate to dashboard so the browser sends
      // the freshly-set auth cookie (with profileCompleted: true).
      // A client-side router.push() can race ahead of the Set-Cookie
      // being processed, causing the middleware to see the OLD token
      // and redirect back to /profile on production (Vercel).
      window.location.replace("/dashboard");

    } catch (err) {
      // Network failure (no internet, server down, etc.)
      setError("Network error. Please try again.");
    } finally {
      // Always turn off the spinner, whether it succeeded or failed
      setLoading(false);
    }
  }

  // ── Step 4: Render the form UI ───────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Show error message if there is one */}
      <Alert>{error}</Alert>

      {/* ────────────── SECTION 1: Personal Information ────────────── */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b pb-2 dark:border-slate-800">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <Input
            label="Full Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            ref={fieldRefs.name}
            error={fieldErrors.name}
          />

          {/* Gender (dropdown) */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              ref={fieldRefs.gender}
              className={
                "min-h-[48px] h-11 w-full rounded-lg border bg-white px-4 text-base text-slate-900 outline-none transition-all shadow-sm " +
                (fieldErrors.gender
                  ? "border-red-400 hover:border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10")
              }
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {fieldErrors.gender && (
              <span className="mt-1 block text-xs font-medium text-red-500">{fieldErrors.gender}</span>
            )}
          </div>

          {/* Age */}
          <Input
            label="Age *"
            name="age"
            type="number"
            min="0"
            max="120"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 35"
            required
            ref={fieldRefs.age}
            error={fieldErrors.age}
          />

          {/* Personal Email */}
          <Input
            label="Personal Email *"
            name="personalEmail"
            type="email"
            value={formData.personalEmail}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            ref={fieldRefs.personalEmail}
            error={fieldErrors.personalEmail}
          />

          {/* Designation */}
          <Input
            label="Designation *"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Doctor"
            required
            ref={fieldRefs.designation}
            error={fieldErrors.designation}
          />
        </div>
      </div>

      {/* ────────────── SECTION 2: Organization Information ────────────── */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b pb-2 dark:border-slate-800">
          Organization Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Organization Name */}
          <Input
            label="Organization Name *"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            placeholder="City Hospital"
            required
            ref={fieldRefs.organizationName}
            error={fieldErrors.organizationName}
          />

          {/* Organization Email */}
          <Input
            label="Organization Email *"
            name="organizationEmail"
            type="email"
            value={formData.organizationEmail}
            onChange={handleChange}
            placeholder="contact@cityhospital.com"
            required
            ref={fieldRefs.organizationEmail}
            error={fieldErrors.organizationEmail}
          />

          {/* Organization Phone */}
          <Input
            label="Organization Phone *"
            name="organizationPhone"
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={formData.organizationPhone}
            onChange={handleChange}
            placeholder="1234567890"
            required
            ref={fieldRefs.organizationPhone}
            error={fieldErrors.organizationPhone}
          />
        </div>

        {/* Organization Address (textarea — takes up full width) */}
        <div className="mt-6">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Organization Address *
          </label>
          <textarea
            name="organizationAddress"
            value={formData.organizationAddress}
            onChange={handleChange}
            required
            rows="3"
            placeholder="123 Health Street, City..."
            ref={fieldRefs.organizationAddress}
            className={
              "min-h-[48px] w-full rounded-lg border bg-white p-4 text-base text-slate-900 outline-none transition-all shadow-sm resize-none " +
              (fieldErrors.organizationAddress
                ? "border-red-400 hover:border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10")
            }
          />
          {fieldErrors.organizationAddress && (
            <span className="mt-1 block text-xs font-medium text-red-500">{fieldErrors.organizationAddress}</span>
          )}
        </div>
      </div>

      {/* ────────────── Submit Button ────────────── */}
      <div className="pt-4 flex justify-end">
        <Button type="submit" loading={loading} className="w-full md:w-auto px-10">
          {mode === "create" ? "Save Profile & Continue" : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}

