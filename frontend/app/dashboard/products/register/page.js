import { redirect } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import { getCurrentUser } from "@/backend/utils/session";
import ProductRegistrationForm from "@/forms/ProductRegistrationForm";

export const metadata = {
  title: "Product Registration | Secure Portal",
  description: "Register a new product for warranty and support coverage.",
};

export default async function ProductRegistrationPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");

  return (
    <MainLayout user={user} active="/dashboard/products/register">
      <ProductRegistrationForm user={user} />
    </MainLayout>
  );
}
