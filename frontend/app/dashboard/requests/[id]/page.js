import { redirect } from "next/navigation";
import { connectDB } from "@/backend/database/connection/db";
import { getCurrentUser } from "@/backend/utils/session";
import BookService from "@/backend/database/models/BookService";
import Product from "@/backend/database/models/Product"; // Needed for .populate("productId")
import MainLayout from "@/layouts/MainLayout";
import RequestDetailsClient from "@/components/userDashboard/RequestDetailsClient";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

// Route: /dashboard/requests/[id]
// Displays full details of a single service request.
export default async function RequestDetailsPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  await connectDB();

  // Fetch the service request — only if it belongs to the current user.
  // Populate productId so we can display product name and link to its page.
  const request = await BookService.findOne({ _id: id, userId: user.id })
    .populate("productId", "productName productModel")
    .lean();

  // If not found (wrong id or doesn't belong to this user)
  if (!request) {
    return (
      <MainLayout user={user} active="/dashboard/requests">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
            <ClipboardList className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Request Not Found</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md">
            The service request you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Link
            href="/dashboard/requests"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            ← Back to My Requests
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Serialize for client component
  const serializedRequest = JSON.parse(JSON.stringify(request));

  return (
    <MainLayout user={user} active="/dashboard/requests">
      <RequestDetailsClient request={serializedRequest} />
    </MainLayout>
  );
}
