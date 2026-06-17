import { redirect } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import { getCurrentUser } from "@/backend/utils/session";
import ProfileForm from "@/forms/ProfileForm";

// UI page component for the /profile/edit route.
export default async function EditProfileRoute() {
  const user = await getCurrentUser();

  // Not logged in → login
  if (!user) redirect("/login");

  return (
    <MainLayout user={user} active="/profile/edit">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Edit Your Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Update your profile information.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 md:p-8">
          <ProfileForm user={user} mode="edit" />
        </div>
      </div>
    </MainLayout>
  );
}
