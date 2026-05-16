import { LayoutDashboard } from "lucide-react";

// UI component for the welcome section on the dashboard.
export default function DashboardHeader({ firstName }) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-10 text-white shadow-xl overflow-hidden mb-12">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-72 h-72 bg-blue-400/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-4 border border-white/20">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Client Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-md leading-relaxed">
            Here is your service overview. Manage requests, track updates, and explore your products seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
