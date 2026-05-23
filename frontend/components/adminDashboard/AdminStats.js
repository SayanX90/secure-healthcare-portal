import { Users, UserCheck, Clock, Activity } from "lucide-react";

// UI component for admin user approval stats.
export default function AdminStats({ totalAdmins, pendingApproval, approvedUsers, recentUsers }) {
  const total = pendingApproval + approvedUsers;
  const approvedPercent = total === 0 ? 0 : Math.round((approvedUsers / total) * 100);
  const pendingPercent = total === 0 ? 0 : 100 - approvedPercent;

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Users className="h-5 w-5 text-primary" />
          Approval Status
        </h3>
        <p className="mt-1 text-sm font-medium text-muted">
          Distribution of approved vs pending users in the system.
        </p>

        <div className="mt-8">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-success">Approved ({approvedPercent}%)</span>
            <span className="text-warning">Pending ({pendingPercent}%)</span>
          </div>
          
          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 flex">
            <div 
              className="bg-emerald-500 transition-all duration-1000 ease-out" 
              style={{ width: `${approvedPercent}%` }}
              title={`${approvedUsers} Approved`}
            />
            <div 
              className="bg-amber-500 transition-all duration-1000 ease-out" 
              style={{ width: `${pendingPercent}%` }}
              title={`${pendingApproval} Pending`}
            />
          </div>

          <div className="mt-6 flex justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-muted">Approved</p>
                <p className="text-2xl font-black text-slate-900 dark:text-foreground">{approvedUsers}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-right flex-row-reverse">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-muted">Pending</p>
                <p className="text-2xl font-black text-slate-900 dark:text-foreground">{pendingApproval}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Activity className="h-5 w-5 text-primary" />
          Recent Signups
        </h3>
        
        <div className="mt-6 space-y-3">
          {recentUsers.map((user) => (
            <div key={user._id.toString()} className="flex items-center justify-between group rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-card p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 dark:bg-slate-700 text-sm font-bold text-white shadow-sm ring-2 ring-slate-100 dark:ring-slate-800">
                  {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-muted">{user.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                  user.isApproved 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/20' 
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/20'
                }`}>
                  {user.isApproved ? "Approved" : "Pending"}
                </span>
                <p className="mt-1.5 text-[10px] font-semibold text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
          
          {recentUsers.length === 0 && (
            <p className="text-sm text-muted">No recent signups found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
