
// Default icon used when no icon is passed in
const DefaultIcon = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function InfoCard({ label, value, icon, trend }) {
  // Decide the trend badge color — green for positive, red for negative
  const trendColor =
    trend > 0
      ? "bg-success/10 text-success"
      : "bg-red-500/10 text-red-600 dark:text-red-400";

  // Show ▲ for positive trend and ▼ for negative trend
  const trendArrow = trend > 0 ? "▲" : "▼";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-white to-[#F8FAFC] p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:from-white hover:to-[#EEF2FF] hover:shadow-md dark:bg-none dark:bg-card">

      {/* Subtle background glow (hidden in dark mode) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-100 to-transparent opacity-30 dark:hidden" />

      <div className="relative flex flex-col gap-4">

        {/* Top row: icon on the left, trend badge on the right */}
        <div className="flex items-start justify-between">

          {/* Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon || DefaultIcon}
          </div>

          {/* Trend badge — only shown if a trend value is passed */}
          {trend && (
            <span className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${trendColor}`}>
              {trendArrow} {Math.abs(trend)}%
            </span>
          )}
        </div>

        {/* Label and value */}
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>

      </div>
    </article>
  );
}
