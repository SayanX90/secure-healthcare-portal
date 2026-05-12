"use client";

import { useAdminTheme } from "@/frontend/components/adminDashboard/ThemeProvider";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useAdminTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-muted transition-colors hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
