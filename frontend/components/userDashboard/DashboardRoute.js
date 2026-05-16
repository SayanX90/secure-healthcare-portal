import { redirect } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import { getCurrentUser } from "@/backend/utils/session";
import DashboardPage from "@/components/userDashboard/DashboardPage";

// UI page component for the /dashboard route.
export default async function DashboardRoute() {
  const user = await getCurrentUser();

  // Not logged in → login
  if (!user) redirect("/login");

  // Admins belong in /admin, not /dashboard
  if (user.role === "admin") redirect("/admin");

  return (
    <MainLayout user={user} active="/dashboard">
      <DashboardPage user={user} />
    </MainLayout>
  );
}
