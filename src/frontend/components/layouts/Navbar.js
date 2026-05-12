"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/frontend/components/ui/ThemeToggle";
import { Bell, LogOut, Menu } from "lucide-react";

export default function Navbar({ user, onMenuToggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-b border-border bg-white/80 backdrop-blur-md dark:bg-card/80 px-4 sm:px-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 mr-4 sm:mr-8">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href={user.role === "admin" ? "/admin" : "/dashboard"}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-foreground sm:block">
            Home Healthcare Services
          </span>
        </Link>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Icon */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>

        {/* Theme Toggle */}
        {pathname?.startsWith("/admin") && <ThemeToggle />}

        <div className="h-6 w-px bg-border" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
            <p className="mt-1 text-xs font-medium capitalize text-muted">{user.role}</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {initials}
          </div>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Sign Out */}
        <button
          onClick={logout}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">{loading ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>
    </header>
  );
}
