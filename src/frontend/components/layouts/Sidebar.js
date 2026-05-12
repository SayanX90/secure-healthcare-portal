import Link from "next/link";
import { LayoutDashboard, Users, Package } from "lucide-react";

const navItems = {
  user: [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/products",
      icon: <Package className="h-5 w-5 shrink-0" />,
      label: "My Products",
    },
  ],
  admin: [
    {
      href: "/admin",
      icon: <Users className="h-5 w-5 shrink-0" />,
      label: "Users & Access",
    },
    {
      href: "/admin/products",
      icon: <Package className="h-5 w-5 shrink-0" />,
      label: "Product Registrations",
    },
  ],
};

function Sidebar({ role, active, isMobileOpen, onClose }) {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-[#F8FAFC] dark:bg-none dark:bg-card border-r border-border transition-transform duration-300 ease-in-out lg:fixed lg:z-40 lg:pt-16 lg:flex lg:flex-col lg:w-56 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 lg:hidden border-b border-border">
          <span className="text-lg font-bold tracking-tight text-foreground">Menu</span>
          <button onClick={onClose} className="p-2 -mr-2 text-muted hover:text-foreground">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4 pt-6 overflow-y-auto h-full">
          {!active?.startsWith("/admin") && (
            <>
              <p className="px-3 pb-2 text-xs font-semibold text-muted uppercase tracking-wider">Overview</p>
              {navItems.user.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active === link.href
                      ? "bg-indigo-50 text-indigo-600 dark:bg-primary/10 dark:text-primary font-semibold"
                      : "text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <span className={active === link.href ? "text-primary" : "text-muted"}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}
            </>
          )}

          {role === "admin" && (
            <>
              {!active?.startsWith("/admin") && <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />}
              <p className="px-3 pb-2 text-xs font-semibold text-muted uppercase tracking-wider">Administration</p>
              {navItems.admin.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active === link.href
                      ? "bg-indigo-50 text-indigo-600 dark:bg-primary/10 dark:text-primary font-semibold"
                      : "text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <span className={active === link.href ? "text-primary" : "text-muted"}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
