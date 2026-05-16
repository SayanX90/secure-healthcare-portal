"use client";

import ErrorBox from "@/ui/ErrorBox";

export default function Error({ error, reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <ErrorBox
        title="Something went wrong"
        message={error?.message || "Please try again in a moment."}
        buttonText="Try again"
        onClick={reset}
      />
    </main>
  );
}
