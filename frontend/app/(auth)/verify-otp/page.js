import { Suspense } from "react";
import OtpForm from "@/forms/OtpForm";
import AuthLayout from "@/ui/AuthLayout";
import Loader from "@/ui/Loader";

export default function VerifyOtpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white dark:bg-transparent">
      <Suspense fallback={<Loader text="Preparing verification" />}>
        <AuthLayout>
          <OtpForm />
        </AuthLayout>
      </Suspense>
    </main>
  );
}


