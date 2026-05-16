import { getAllProductsHandler } from "@/backend/controllers/productController";
export async function GET(req, context) {
  return getAllProductsHandler(req, context);
}
