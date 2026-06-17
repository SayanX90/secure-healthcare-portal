import { redirect } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import { getCurrentUser } from "@/backend/utils/session";
import { connectDB } from "@/backend/database/connection/db";
import BookService from "@/backend/database/models/BookService";
import Product from "@/backend/database/models/Product"; // Needed for .populate("productId")
import { ClipboardList, CheckCircle2, Clock } from "lucide-react";
import RequestList from "@/components/userDashboard/RequestList";

// This is the server component for /dashboard/requests.
// It fetches data from MongoDB and passes it to the client component.
export default async function RequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  // Fetch all service requests for this user, newest first.
  // Populate productId so we can show the product name in the table.
  const requests = await BookService.find({ userId: user.id })
    .populate("productId", "productName productModel")
    .sort({ createdAt: -1 })
    .lean();

  // Count stats for the stat cards at the top
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const resolvedCount = requests.filter((r) => r.status === "Resolved").length;

  // Serialize MongoDB objects (ObjectId, Date) into plain JSON strings
  const serializedRequests = JSON.parse(JSON.stringify(requests));

  return (
    <MainLayout user={user} active="/dashboard/requests">
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <ClipboardList className="h-3.5 w-3.5" />
            </div>
            <span className="text-orange-600">Dashboard</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Requests
          </h1>
          <p className="mt-1 text-sm font-medium text-muted">
            Track all your submitted service requests.
          </p>
        </div>

        {/* The actual request list table */}
        <RequestList requests={serializedRequests} />
      </div>
    </MainLayout>
  );
}
