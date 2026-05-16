"use client";

import { Shield, CheckCircle2, Clock } from "lucide-react";

// Badge: shows a colored pill label with an optional icon.
// Exported so UsersTable can import it for use inside UserModal.
export function Badge({ children, color, icon: Icon }) {
  const colors = {
    green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400",
    red: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400",
    yellow: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400",
    purple: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400",
    slate: "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-300",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${colors[color] || colors.slate}`}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

// Avatar: shows the user's initials in a circle.
// Exported so UsersTable can import it for use inside UserModal.
export function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 dark:bg-slate-700 text-sm font-bold text-white shadow-sm ring-2 ring-slate-100 dark:ring-slate-800">
      {initials}
    </div>
  );
}

// UserRow: renders a single <tr> in the admin users table.
// Props:
//   user     — the user object from the database
//   onSelect — called with the user object when the row is clicked
export default function UserRow({ user, onSelect }) {
  return (
    <tr
      onClick={() => onSelect(user)}
      className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5 group border-b border-slate-200 dark:border-border last:border-0"
    >
      {/* Name + email */}
      <td className="px-6 py-4 text-left">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} />
          <div>
            <p className="font-bold text-slate-900 dark:text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {user.name}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-muted mt-0.5">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role badge — hidden on very small screens */}
      <td className="px-6 py-4 hidden sm:table-cell text-center">
        <Badge color={user.role === "admin" ? "purple" : "slate"} icon={user.role === "admin" ? Shield : null}>
          {user.role === "admin" ? "Admin" : "User"}
        </Badge>
      </td>

      {/* Approval status badge */}
      <td className="px-6 py-4 text-center">
        <Badge color={user.isApproved ? "green" : "yellow"} icon={user.isApproved ? CheckCircle2 : Clock}>
          {user.isApproved ? "Approved" : "Pending"}
        </Badge>
      </td>

      {/* Join date — hidden on small/medium screens */}
      <td className="px-6 py-4 hidden lg:table-cell text-slate-600 dark:text-muted font-medium text-center">
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
    </tr>
  );
}
