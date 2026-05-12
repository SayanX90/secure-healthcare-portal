import { Suspense } from "react";
import AuthForm from "@/frontend/components/forms/AuthForm";
import Loader from "@/frontend/components/ui/Loader";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white dark:bg-transparent">
      <Suspense fallback={<Loader text="Preparing login" />}>
        <AuthForm type="login" />
      </Suspense>
    </main>
  );
}
