import { adminCheckHandler } from "@/backend/controllers/adminController";
export async function GET(req, context) {
  return adminCheckHandler(req, context);
}
