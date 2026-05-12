import { redirect } from "next/navigation";
import MainLayout from "@/frontend/components/layouts/MainLayout";
import { getCurrentUser } from "@/backend/utils/session";
import { connectDB } from "@/database/connection/db";
import Product from "@/database/models/Product";
import { Package, ShieldCheck, Clock } from "lucide-react";
import ProductList from "@/frontend/components/userDashboard/ProductList";

// UI page component for the /dashboard/products route.
export default async function ProductsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  await connectDB();
  
  const products = await Product.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .lean();

  const totalProducts = products.length;
  const approvedCount = products.filter((p) => p.status === "approved").length;
  const pendingCount  = products.filter((p) => p.status === "pending").length;

  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <MainLayout user={user} active="/dashboard/products">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <Package className="h-3.5 w-3.5" />
            </div>
            <span className="text-indigo-600">Dashboard</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Products
          </h1>
          <p className="mt-1 text-sm font-medium text-muted">
            Track your registered products, warranty status, and documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-[#F8FAFC] dark:bg-none dark:bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Total Products</p>
                <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-[#F8FAFC] dark:bg-none dark:bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Approved Warranties</p>
                <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-[#F8FAFC] dark:bg-none dark:bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Pending Approval</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        <ProductList products={serializedProducts} />
      </div>
    </MainLayout>
  );
}
