import { registerProductHandler } from "@/backend/controllers/productController";
export async function POST(req, context) {
  return registerProductHandler(req, context);
}
