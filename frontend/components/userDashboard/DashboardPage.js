"use client";

import { BookOpen, Package, PackagePlus } from "lucide-react";
import DashboardCards from "@/components/userDashboard/DashboardCards";
import DashboardHeader from "@/components/userDashboard/DashboardHeader";

const dashboardActions = [

  {
    id: "product-registration",
    title: "Product Registration",
    description: "Register new products for warranty and support coverage.",
    icon: PackagePlus,
    color: "bg-violet-50 text-violet-600",
    hoverBorder: "hover:border-violet-300",
    badge: null,
    href: "/dashboard/products/register",
  },
  {
    id: "my-products",
    title: "My Products",
    description: "View and manage all your registered products and warranties.",
    icon: Package,
    color: "bg-indigo-50 text-indigo-600",
    hoverBorder: "hover:border-indigo-300",
    badge: null,
    href: "/dashboard/products",
    showGetStarted: false,
  },
  {
    id: "e-learning",
    title: "E-Learning",
    description: "Access training modules, tutorials, and learning resources.",
    icon: BookOpen,
    color: "bg-orange-50 text-orange-600",
    hoverBorder: "hover:border-orange-300",
    badge: "Inactive",
    href: null,
  },

];

// UI component for the user dashboard screen.
export default function DashboardPage({ user }) {
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader firstName={firstName} />

      <div className="space-y-8">
        <DashboardCards actions={dashboardActions} />
      </div>
    </div>
  );
}
