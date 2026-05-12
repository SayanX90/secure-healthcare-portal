"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Alert from "@/frontend/components/ui/Alert";
import Button from "@/frontend/components/ui/Button";
import Input from "@/frontend/components/ui/Input";

const featureCards = [
  { title: "24/7", text: "Care access" },
  { title: "JWT", text: "Secure login" },
  { title: "Role", text: "Based access" },
];

// UI component for login and signup pages.
export default function AuthForm({ type }) {
  const isSignup = type === "signup";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const name = form.name.trim();

    if (isSignup && !name) {
      setError("Full name is required.");
      return;
    }

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const url = isSignup ? "/api/auth/signup" : "/api/auth/login";
    const body = isSignup ? { name, email, password } : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Something went wrong.";
        setError(message);

        if (!isSignup && message.toLowerCase().includes("verify your email")) {
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
          }, 1200);
        }

        return;
      }

      if (isSignup) {
        setSuccess("Account created. Check your email for the OTP.");
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
          router.refresh();
        }, 900);
        return;
      }

      const homePage = data.user.role === "admin" ? "/admin" : "/dashboard";
      router.replace(searchParams.get("next") || homePage);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-200 to-emerald-50 border border-emerald-100 shadow-sm overflow-hidden p-4 sm:p-8 lg:p-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-[20px] bg-emerald-700 text-white font-extrabold text-xl sm:text-2xl shadow-sm">
              H+
            </div>
            <div>
              <span className="block text-sm sm:text-base font-bold tracking-wide text-emerald-950 uppercase">
                Home Healthcare Services Company
              </span>
              <span className="block text-xs sm:text-[15px] text-emerald-800 font-medium mt-0.5">
                Secure care management portal
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-6 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            Staff Login
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-20 items-center">
          <section>
            <div className="mb-8 sm:mb-12">
              <p className="text-xs font-bold tracking-widest text-teal-800 uppercase mb-3 sm:mb-4">
                Patient Care Starts Here
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 mb-3 sm:mb-6">
                Manage home healthcare access with confidence.
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-md">
                A clean and secure portal for care teams, coordinators, and administrators.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col items-center text-center rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg shadow-emerald-900/20"
                >
                  <span className="text-lg sm:text-xl font-bold text-emerald-600 mb-1">
                    {card.title}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {card.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-emerald-900/20 p-5 sm:p-8 lg:p-10">
            <div className="mb-6">
              <p className="text-xs font-bold text-emerald-600 mb-2">
                {isSignup ? "Create account" : "Welcome back"}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                {isSignup ? "Sign up" : "Login to portal"}
              </h2>
              <p className="text-xs text-muted">
                {isSignup
                  ? "Create a user account for the care portal."
                  : "Enter your email and password."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Alert>{error}</Alert>
              {success ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  {success}
                </div>
              ) : null}

              {isSignup ? (
                <Input
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              ) : null}

              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />

              <Button className="w-full mt-2" loading={loading} type="submit">
                {isSignup ? "Create account" : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted">
              {isSignup ? "Already have an account?" : "Do not have an account?"}{" "}
              <Link
                className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                href={isSignup ? "/login" : "/signup"}
              >
                {isSignup ? "Login" : "Signup"}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
