"use client";
// ProfileForm.js — A form to create or edit a user's profile.

// ──────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useRouter } from "next/navigation";

// Reusable UI components from our project
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import Alert from "@/ui/Alert";

// ─── The Component ───────────────────────────────────────────────────────────
// Props:
//   • user  — existing user data (used to pre-fill the form when editing)
//   • mode  — "create" (first time) or "edit" (updating existing profile)
// ──────────────────────────────────────────────────────────────────────────────

export default function ProfileForm({ user, mode = "create" }) {

  const router = useRouter();


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

  // Error message shown at the top of the form
  const [error, setError] = useState("");

  // Loading spinner on the submit button while saving
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    // Copy all old values, but overwrite the one that changed
    setFormData(function (oldData) {
      return { ...oldData, [fieldName]: fieldValue };
    });
  }

  // ── Step 3: Handle form submission ───────────────────────────────────────
  // Runs when the user clicks the submit button.

  async function handleSubmit(e) {
    // Prevent the browser from reloading the page (default form behavior)
    e.preventDefault();

    // Clear any previous error
    setError("");

    // --- Basic validation: make sure nothing is empty ---
    const allFieldsFilled =
      formData.name &&
      formData.gender &&
      formData.age &&
      formData.personalEmail &&
      formData.designation &&
      formData.organizationName &&
      formData.organizationEmail &&
      formData.organizationPhone &&
      formData.organizationAddress;

    if (!allFieldsFilled) {
      setError("Please fill in all required fields.");
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

      // ✅ Success! Redirect to the dashboard
      router.push("/dashboard");
      router.refresh(); // Refresh server data so dashboard shows new info

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
              className="min-h-[48px] h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
          />

          {/* Designation */}
          <Input
            label="Designation *"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Doctor"
            required
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
          />

          {/* Organization Phone */}
          <Input
            label="Organization Phone *"
            name="organizationPhone"
            type="tel"
            value={formData.organizationPhone}
            onChange={handleChange}
            placeholder="1234567890"
            required
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
            className="min-h-[48px] w-full rounded-lg border border-slate-200 bg-white p-4 text-base text-slate-900 outline-none transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm resize-none"
          />
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
