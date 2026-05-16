import { getUsersHandler } from "@/backend/controllers/userController";
export async function GET(req, context) {
  return getUsersHandler(req, context);
}
