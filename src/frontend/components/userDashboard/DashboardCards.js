import { ChevronRight, Search } from "lucide-react";

function ActionCard({ action }) {
  return (
    <a
      href={action.href}
      className={`group relative flex flex-col p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${action.hoverBorder}`}
    >
      {action.badge && (
        <span className="absolute top-5 right-5 flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-2 text-xs font-bold text-white shadow-md">
          {action.badge}
        </span>
      )}
      <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${action.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <action.icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
        {action.title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
        {action.description}
      </p>
      <div className="mt-auto flex items-center font-semibold text-sm text-indigo-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        Get Started <ChevronRight className="ml-1 h-4 w-4" />
      </div>
    </a>
  );
}

// UI component for the dashboard action cards.
export default function DashboardCards({ actions }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
      </div>

      {actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
          <Search className="h-8 w-8 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-500">No actions match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}
