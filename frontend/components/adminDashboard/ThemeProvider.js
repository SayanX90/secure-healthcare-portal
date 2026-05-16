"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export default function ThemeProvider({ children, isAdmin }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAdmin) return;
    const storedTheme = localStorage.getItem("admin-theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  }, [isAdmin]);

  const toggleTheme = () => {
    if (!isAdmin) return;
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("admin-theme", newTheme);
  };

  const isDark = mounted && isAdmin && theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "light", toggleTheme }}>
      <div className={`${isDark ? "dark bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"} flex min-h-screen flex-col transition-colors duration-300 ease-in-out`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(ThemeContext);
}
