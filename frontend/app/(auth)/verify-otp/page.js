import { Suspense } from "react";
import OtpForm from "@/forms/OtpForm";
import Loader from "@/ui/Loader";

export default function VerifyOtpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 dark:bg-transparent">
      <Suspense fallback={<Loader text="Preparing verification" />}>
        <OtpForm />
      </Suspense>
    </main>
  );
}
