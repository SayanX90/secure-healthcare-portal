"use client";

import { Suspense } from "react";
import AuthForm from "@/forms/AuthForm";
import Loader from "@/ui/Loader";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white dark:bg-transparent">
      <Suspense fallback={<Loader text="Preparing signup" />}>
        <AuthForm type="signup" />
      </Suspense>
    </main>
  );
}
