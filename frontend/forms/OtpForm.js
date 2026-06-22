"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Shield } from "lucide-react";
import Alert from "@/ui/Alert";
import Button from "@/ui/Button";



// UI component for OTP verification – uses the SAME card layout as AuthForm.
export default function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // ─── TESTING ONLY: Fetch OTP from DB so testers can see it on screen ────────
  const [testingOtp, setTestingOtp] = useState(null);
  const isDev = process.env.NODE_ENV !== "production";

  async function fetchTestingOtp() {
    if (!isDev || !phone) return;
    try {
      const res = await fetch(`/api/auth/testing-otp?phone=${phone}`);
      const data = await res.json();
      if (data.otp) setTestingOtp(data.otp);
    } catch {
      // Silently ignore — testing convenience only
    }
  }

  useEffect(() => {
    fetchTestingOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);


  // On resend, this gets updated with the new expiresAt from the server response.
  const [expiresAt, setExpiresAt] = useState(() => Date.now() + 2 * 60 * 1000);

  // Countdown timer that syncs with the server's expiresAt timestamp.
  // Instead of a simple decrement (which drifts over time), we recalculate
  // the remaining seconds from the actual expiry time every second.
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    // Immediately calculate how much time is left based on the server timestamp
    function calcRemaining() {
      return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    }

    // Set the initial value right away
    setTimeLeft(calcRemaining());

    // Update every second — each tick recalculates from the real expiry,
    // so even if a tick is delayed (e.g. tab was in background), it stays accurate
    const timer = setInterval(() => {
      const remaining = calcRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]); // Re-run whenever expiresAt changes (e.g. after resend)

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  function handleChange(index, e) {
    setError("");
    setSuccess("");
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const otpString = otp.join("");

    if (otpString.length !== 4) {
      setError("OTP must be exactly 4 digits.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpString }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to verify OTP.");
        if (data.message === "OTP mismatch" || data.message === "OTP expired. Please resend OTP.") {
          // OTP MISMATCH FIX: Immediately stop the countdown timer and show 0:00.
          setExpiresAt(Date.now());
        }
        return;
      }

      setSuccess("Logged in successfully!");
      setTimeout(() => {
        // ISSUE 2 FIX: Decide where to send the user after OTP verification.
        // - New user (isNewUser=true) → always goes to /profile to complete their details
        if (data.isNewUser || !data.user.profileCompleted) {
          // New user OR existing user who hasn't completed profile → profile page
          router.replace("/profile");
        } else {
          // Existing user with completed profile → their home page
          const homePage = data.user.role === "admin" ? "/admin" : "/dashboard";
          router.replace(searchParams.get("next") || homePage);
        }
        router.refresh();
      }, 1000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to resend OTP.");
        return;
      }

      setSuccess("OTP resent successfully.");
      // Re-fetch the new testing OTP after resend
      fetchTestingOtp();

      // ISSUE 4 FIX: Use the server-provided expiresAt timestamp to reset the timer.
      // This ensures the countdown is perfectly synced with the actual OTP expiry
      // in the database, rather than relying on an imprecise local 120-second reset.
      if (data.expiresAt) {
        setExpiresAt(new Date(data.expiresAt).getTime());
      } else {
        // Fallback: if server didn't send expiresAt, use 2 minutes from now
        setExpiresAt(Date.now() + 2 * 60 * 1000);
      }

      setOtp(["", "", "", ""]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-emerald-900/20 p-5 sm:p-8 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-bold text-emerald-600 mb-2">
          Step 2 of 2
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Verify OTP
        </h2>
        <p className="text-xs text-muted text-slate-500">
          We&apos;ve sent a 4-digit code to +91 {phone}. It expires in{" "}
          <span className={`font-semibold ${timeLeft > 0 ? "text-emerald-700" : "text-red-500"}`}>
            {formattedTime}
          </span>.
        </p>

        {/* ── TESTING PREVIEW CHIP: Compact info row for dev/testing ── */}
        {isDev && testingOtp && (
          <div className="mt-4 mx-auto flex w-fit items-center justify-center gap-2 rounded-full border border-green-200 bg-[#F0FDF4] px-4 py-1.5 transition-all hover:shadow-sm">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-800">
              Current Verification Code:
            </span>
            <span className="text-sm font-bold tracking-wider text-green-900 font-mono">
              {testingOtp}
            </span>
          </div>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Alert>{error}</Alert>
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            ✓ {success}
          </div>
        ) : null}

        {/* OTP field – 4 separate boxes */}
        <div>
          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
            4-digit OTP
          </span>
          <div className="flex gap-3 justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className="focus-ring h-14 w-full rounded-xl border border-slate-200 bg-white text-center text-2xl font-black text-slate-900 shadow-sm transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 disabled:bg-slate-50"
              />
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-2"
          type="submit"
          loading={loading}
        >
          {loading ? "Verifying…" : "Verify OTP"}
        </Button>

        {/* Resend OTP button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0 || resending}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors mt-1"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        Wrong phone number?{" "}
        <Link
          className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          href="/login"
        >
          Go back
        </Link>
      </p>
    </section>
  );
}
