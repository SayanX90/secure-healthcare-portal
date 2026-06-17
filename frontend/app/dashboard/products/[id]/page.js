import { redirect } from "next/navigation";
import { connectDB } from "@/backend/database/connection/db";
import { getCurrentUser } from "@/backend/utils/session";
import Product from "@/backend/database/models/Product";
import MainLayout from "@/layouts/MainLayout";
import ProductDetailsClient from "@/components/userDashboard/ProductDetailsClient";
import { Package } from "lucide-react";
import Link from "next/link";

// Route: /dashboard/products/[id]
// Displays full product registration details for the logged-in user.
export default async function ProductDetailsPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  await connectDB();

  // Fetch product — only if it belongs to the current user
  const product = await Product.findOne({ _id: id, userId: user.id }).lean();

  // If no product found (wrong id or doesn't belong to this user)
  if (!product) {
    return (
      <MainLayout user={user} active="/dashboard/products">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md">
            The product you&#39;re looking for doesn&#39;t exist or you don&#39;t have access to it.
          </p>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            ← Back to My Products
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Serialize for client component (converts ObjectId & Date to plain strings)
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <MainLayout user={user} active="/dashboard/products">
      <ProductDetailsClient
        product={serializedProduct}
      />
    </MainLayout>
  );
}
