import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

// Import layouts and components
import MainLayout from "@/layouts/MainLayout";
import AdminStats from "@/components/adminDashboard/AdminStats";
import InfoCard from "@/components/adminDashboard/InfoCard";

// Import backend utilities and database models
import { getCurrentUser } from "@/backend/utils/session";
import { connectDB } from "@/backend/database/connection/db";
import User from "@/backend/database/models/User";

// Load the Users table only when needed (lazy loading for better performance)
const UsersTable = dynamic(
  () => import("@/tables/adminTables/UsersTable"),
  {
    loading: () => (
      <div className="mt-8 h-64 rounded-2xl border border-border bg-white animate-pulse" />
    ),
  }
);

// Icons used in the stat cards
const UsersIcon = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AdminIcon = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PendingIcon = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Admin page — only accessible by admin users
export default async function AdminPage() {
  // Get the logged-in user
  const user = await getCurrentUser();

  // Redirect if not logged in or not an admin
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  // Connect to the database and fetch all users
  await connectDB();
  const users = await User.find({})
    .sort({ isApproved: 1, createdAt: -1 })
    .select("name phone role isVerified isApproved createdAt")
    .lean();

  // Calculate summary numbers for the stat cards
  const totalUsers     = users.length;
  const totalAdmins    = users.filter((u) => u.role === "admin").length;
  const pendingApproval = users.filter((u) => !u.isApproved).length;
  const approvedUsers  = users.filter((u) => u.isApproved).length;
  const recentUsers    = users.slice(0, 5);

  return (
    <MainLayout user={user} active="/admin">
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-3.5 w-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-primary">Admin Panel</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Users &amp; Access Control
          </h1>
          <p className="mt-1 text-sm font-medium text-muted">
            Manage accounts, roles, and approval status across your platform.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <InfoCard label="Total Users"      value={totalUsers}     icon={UsersIcon} />
          <InfoCard label="Admins"           value={totalAdmins}    icon={AdminIcon} />
          <InfoCard label="Pending Approval" value={pendingApproval} icon={PendingIcon} />
        </div>

        {/* Admin statistics overview */}
        <AdminStats
          totalAdmins={totalAdmins}
          pendingApproval={pendingApproval}
          approvedUsers={approvedUsers}
          recentUsers={recentUsers}
        />

        {/* Full users table */}
        <UsersTable
          users={JSON.parse(JSON.stringify(users))}
          currentUser={user}
        />

      </div>
    </MainLayout>
  );
}
