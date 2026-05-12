import { updateProductStatusHandler } from "@/backend/controllers/productController";

export async function PATCH(request, { params }) {
  const { id } = await params;
  return updateProductStatusHandler(request, id);
}
