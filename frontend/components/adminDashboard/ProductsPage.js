import { redirect } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import InfoCard from "@/components/adminDashboard/InfoCard";
import ProductsTable from "@/tables/userTables/ProductsTable";
import { getCurrentUser } from "@/backend/utils/session";
import { connectDB } from "@/backend/database/connection/db";
import Product from "@/backend/database/models/Product";

// UI page component for the /admin/products route.
export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  await connectDB();

  const products = await Product.find({})
    .populate("userId", "name phone")
    .sort({ createdAt: -1 })
    .lean();

  const totalProducts = products.length;
  const pendingCount = products.filter((p) => p.status === "pending").length;
  const approvedCount = products.filter((p) => p.status === "approved").length;
  const rejectedCount = products.filter((p) => p.status === "rejected").length;

  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <MainLayout user={user} active="/admin/products">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-indigo-600">Admin Panel</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Product Registrations
          </h1>
          <p className="mt-1 text-sm font-medium text-muted">
            Manage, approve, or reject customer product warranty registrations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <InfoCard
            label="Total Registrations"
            value={totalProducts}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <InfoCard
            label="Pending Approval"
            value={pendingCount}
            icon={
              <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <InfoCard
            label="Approved"
            value={approvedCount}
            icon={
              <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <InfoCard
            label="Rejected"
            value={rejectedCount}
            icon={
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <ProductsTable products={serializedProducts} />
      </div>
    </MainLayout>
  );
}
