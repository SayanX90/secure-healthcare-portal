import { redirect } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import { getCurrentUser } from "@/backend/utils/session";
import ProfileForm from "@/forms/ProfileForm";

// UI page component for the /profile route.
export default async function ProfileRoute() {
  const user = await getCurrentUser();

  // Not logged in → login
  if (!user) redirect("/login");

  // If already completed profile, they shouldn't be forced here unless they want to edit.
  // But let's allow them to view it anyway.

  return (
    <MainLayout user={user} active="/profile">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Complete Your Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Please provide your details to continue using the portal.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 md:p-8">
          <ProfileForm user={user} />
        </div>
      </div>
    </MainLayout>
  );
}
