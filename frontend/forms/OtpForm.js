"use client";

// ─── Imports ──────────────────────────────────────────────────────────────────
// These are tools we need from Next.js and React
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

// Our own reusable UI components
import Alert from "@/ui/Alert";
import Button from "@/ui/Button";
import Input from "@/ui/Input";

// ─── OtpForm Component ────────────────────────────────────────────────────────
export default function OtpForm() {
  // router lets us navigate to another page (like /login)
  const router = useRouter();

  // searchParams lets us read URL query params like ?email=abc@xyz.com
  const searchParams = useSearchParams();

  // ── State variables ──────────────────────────────────────────────────────────
  // form holds the email and otp values that the user types
  const [form, setForm] = useState({
    email: searchParams.get("email") || "", // pre-fill email from URL if available
    otp: "",
  });

  const [error, setError] = useState("");     // error message to show the user
  const [success, setSuccess] = useState(""); // success message to show the user
  const [loading, setLoading] = useState(false); // true while the API request is running

  // timeLeft counts down from 120 seconds (2 minutes)
  const [timeLeft, setTimeLeft] = useState(120);

  // ── Countdown Timer ──────────────────────────────────────────────────────────
  // This runs once when the component first loads
  // It ticks down timeLeft by 1 every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current > 0) return current - 1; // subtract 1 each second
        return 0;                             // stop at 0, don't go negative
      });
    }, 1000);

    // Cleanup: stop the timer when the component is removed from the screen
    return () => clearInterval(timer);
  }, []);

  // When the timer reaches 0, redirect back to /signup automatically
  useEffect(() => {
    if (timeLeft === 0) {
      router.push("/signup");
    }
  }, [timeLeft, router]);

  // ── Format time as MM:SS (e.g. 1:05) ────────────────────────────────────────
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // ── handleChange ─────────────────────────────────────────────────────────────
  // Called every time the user types in any input field
  function handleChange(e) {
    // Clear any previous error or success message
    setError("");
    setSuccess("");

    const { name, value } = e.target;

    // Special rule for the OTP field:
    // - Only allow digits (no letters or symbols)
    // - Maximum 6 characters
    let cleanValue = value;
    if (name === "otp") {
      cleanValue = value
        .replace(/\D/g, "") // remove any non-digit character
        .slice(0, 6);        // keep only the first 6 digits
    }

    // Update only the field that changed, keep the rest the same
    setForm((prev) => ({ ...prev, [name]: cleanValue }));
  }

  // ── handleSubmit ─────────────────────────────────────────────────────────────
  // Called when the user clicks "Verify email"
  async function handleSubmit(e) {
    e.preventDefault(); // stop the page from refreshing
    setError("");
    setSuccess("");

    // Trim whitespace from both values
    const email = form.email.trim();
    const otp   = form.otp.trim();

    // ── Validation (check before sending to server) ───────────────────────────
    if (!email) {
      setError("Email is required.");
      return;
    }

    // OTP must be exactly 6 digits
    const isValidOtp = /^\d{6}$/.test(otp);
    if (!isValidOtp) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    // ── Send request to the API ───────────────────────────────────────────────
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      // If the server returned an error
      if (!response.ok) {
        setError(data.message || "Unable to verify OTP.");
        return;
      }

      // Success! Show message then redirect to /login after 2.5 seconds
      setSuccess("Email verified! Waiting for admin approval.");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 2500);

    } catch {
      // Network/connection error (e.g. no internet)
      setError("Network error. Please try again.");
    } finally {
      // Always stop loading, whether it succeeded or failed
      setLoading(false);
    }
  }

  // ── Render (what the user sees on screen) ───────────────────────────────────
  return (
    <div className="w-full max-w-md px-4">
      <div className="rounded-3xl border border-white/80 bg-white/80 shadow-xl shadow-emerald-100/50 backdrop-blur-sm overflow-hidden">

        {/* Green top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-600" />

        <div className="px-7 py-9 sm:px-10">

          {/* Logo + company name */}
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-emerald-700 text-white font-extrabold text-lg shadow-sm">
              H+
            </div>
            <span className="text-xs font-bold tracking-wide text-emerald-950 uppercase leading-tight">
              Home Healthcare<br />Services Company
            </span>
          </div>

          {/* Page heading */}
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Step 2 of 2
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Verify your email
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              We&apos;ve sent a 6-digit code to your email. It expires in{" "}
              {/* Timer turns red when it runs out */}
              <span className={`font-semibold ${timeLeft > 0 ? "text-emerald-700" : "text-red-500"}`}>
                {formattedTime}
              </span>.
            </p>
          </div>

          {/* The form */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Show error message if there is one */}
            <Alert>{error}</Alert>

            {/* Show success message if there is one */}
            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                ✓ {success}
              </div>
            )}

            {/* Email field */}
            <Input
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="you@example.com"
              required
            />

            {/* OTP field – large centered digits */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                6-digit OTP
              </span>
              <input
                name="otp"
                value={form.otp}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={6}
                disabled={loading}
                placeholder="· · · · · ·"
                required
                className="focus-ring h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-center text-2xl font-black tracking-[0.5em] text-slate-900 shadow-sm transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder:tracking-normal placeholder:text-slate-300 placeholder:text-lg disabled:bg-slate-50"
              />
            </label>

            {/* Submit button – disabled when timer runs out or while loading */}
            <Button
              className="w-full mt-4"
              type="submit"
              loading={loading}
              disabled={timeLeft === 0}
            >
              {loading ? "Verifying…" : "Verify email →"}
            </Button>

          </form>

          {/* Link back to signup */}
          <p className="mt-5 text-center text-sm text-slate-600">
            Wrong email?{" "}
            <Link
              href="/signup"
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
            >
              Go back
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
