import { ChevronRight } from "lucide-react";


function ActionCard({ action }) {
  // If href is null/undefined, the card is disabled (e.g. "Coming Soon")
  const isDisabled = !action.href;

  // Common card styles shared by both enabled and disabled cards
  const baseCardStyles =
    "group relative flex flex-col p-6 rounded-3xl bg-white border border-slate-100 shadow-sm";

  // ── Disabled Card (no link, greyed out) ──
  if (isDisabled) {
    return (
      <div className={`${baseCardStyles} opacity-60 cursor-not-allowed select-none`}>
        {/* Badge (top-right corner, greyed out) */}
        {action.badge && (
          <span className="absolute top-5 right-5 flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold text-white shadow-md bg-slate-400">
            {action.badge}
          </span>
        )}

        {/* Icon */}
        <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${action.color}`}>
          <action.icon className="h-7 w-7" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold mb-1 text-slate-400">{action.title}</h3>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 flex-1 text-slate-400">
          {action.description}
        </p>

        {/* "Coming Soon" label */}
        <div className="mt-auto flex items-center font-semibold text-sm text-slate-400">
          Coming Soon
        </div>
      </div>
    );
  }

  // ── Enabled Card (clickable link) ──
  return (
    <a
      href={action.href}
      className={`${baseCardStyles} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${action.hoverBorder}`}
    >
      {/* Badge (top-right corner, coloured) */}
      {action.badge && (
        <span className="absolute top-5 right-5 flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold text-white shadow-md bg-indigo-600">
          {action.badge}
        </span>
      )}

      {/* Icon – scales up and rotates slightly on hover */}
      <div
        className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${action.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
      >
        <action.icon className="h-7 w-7" />
      </div>

      {/* Title – turns indigo on hover */}
      <h3 className="text-lg font-bold mb-1 text-slate-900 transition-colors group-hover:text-indigo-600">
        {action.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4 flex-1 text-slate-500">
        {action.description}
      </p>

      {/* "Get Started" link – slides in from the left on hover */}
      {action.showGetStarted !== false && (
        <div className="mt-auto flex items-center font-semibold text-sm text-indigo-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Get Started <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      )}
    </a>
  );
}

// ---------- Main Cards Grid Component ----------
// Receives an "actions" array and renders a grid of ActionCards.
export default function DashboardCards({ actions }) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
      </div>

      {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}
