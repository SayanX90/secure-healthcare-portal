"use client";

import { useState } from "react";
import { ClipboardList, PackagePlus, PlusCircle } from "lucide-react";
import DashboardCards from "@/frontend/components/userDashboard/DashboardCards";
import DashboardHeader from "@/frontend/components/userDashboard/DashboardHeader";
import SearchBar from "@/frontend/components/userDashboard/SearchBar";

const dashboardActions = [
  {
    id: "new-complaint",
    title: "New Complaint",
    description: "Submit a new service complaint or issue report instantly.",
    icon: PlusCircle,
    color: "bg-blue-50 text-blue-600",
    hoverBorder: "hover:border-blue-300",
    badge: null,
    href: "/dashboard/complaints/new",
  },
  {
    id: "all-complaints",
    title: "All Complaints",
    description: "View and manage all your submitted complaints history.",
    icon: ClipboardList,
    color: "bg-indigo-50 text-indigo-600",
    hoverBorder: "hover:border-indigo-300",
    badge: "12",
    href: "/dashboard/complaints",
  },
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
];

// UI component for the user dashboard screen.
export default function DashboardPage({ user }) {
  const [search, setSearch] = useState("");
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const searchText = search.trim().toLowerCase();

  const visibleActions = searchText
    ? dashboardActions.filter(
      (action) =>
        action.title.toLowerCase().includes(searchText) ||
        action.description.toLowerCase().includes(searchText)
    )
    : dashboardActions;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader firstName={firstName} />

      <div className="space-y-8">
        <SearchBar value={search} onChange={setSearch} />
        <DashboardCards actions={visibleActions} />
      </div>
    </div>
  );
}
