"use client";

import { useState } from "react";
import Navbar from "@/frontend/components/layouts/Navbar";
import Sidebar from "@/frontend/components/layouts/Sidebar";
import ThemeProvider from "@/frontend/components/adminDashboard/ThemeProvider";

export default function MainLayout({ user, active, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = active?.startsWith("/admin");

  return (
    <ThemeProvider isAdmin={isAdmin}>
      <Navbar user={user} onMenuToggle={() => setIsMobileMenuOpen(true)} />
      <div className="flex flex-1 min-w-0 relative">
        <Sidebar 
          role={user.role} 
          active={active} 
          isMobileOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
        <main className="flex-1 overflow-x-hidden bg-gradient-to-br from-sky-100 via-indigo-100 to-violet-100 dark:bg-none dark:bg-background lg:ml-56">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 lg:pb-12 min-w-0">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
