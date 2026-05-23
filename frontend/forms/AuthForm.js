"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Alert from "@/ui/Alert";
import Button from "@/ui/Button";
import Input from "@/ui/Input";

const featureCards = [
  { title: "24/7", text: "Care access" },
  { title: "JWT", text: "Secure login" },
  { title: "Role", text: "Based access" },
];

// UI component for phone number login.
export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setError("");
    setSuccess("");
    setPhone(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess("OTP sent successfully to your phone.");
      setTimeout(() => {
        const nextUrl = searchParams.get("next");
        const redirectUrl = `/verify-otp?phone=${encodeURIComponent(phone)}${nextUrl ? `&next=${encodeURIComponent(nextUrl)}` : ""}`;
        router.push(redirectUrl);
        router.refresh();
      }, 1000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-emerald-900/20 p-5 sm:p-8 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-bold text-emerald-600 mb-2">
          Welcome back
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Login to portal
        </h2>
        <p className="text-xs text-muted text-slate-500">
          Enter your 10-digit phone number.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Alert>{error}</Alert>
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {success}
          </div>
        ) : null}

        <div className="flex gap-2">
          <div className="w-16">
            <Input
              label="Code"
              name="countryCode"
              value="+91"
              disabled
            />
          </div>
          <div className="flex-1">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength={10}
              required
            />
          </div>
        </div>

        <Button className="w-full mt-2" loading={loading} type="submit">
          Send OTP
        </Button>
      </form>
    </section>
  );
}
