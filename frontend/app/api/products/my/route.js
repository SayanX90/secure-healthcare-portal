import { getMyProductsHandler } from "@/backend/controllers/productController";
export async function GET(req, context) {
  return getMyProductsHandler(req, context);
}
