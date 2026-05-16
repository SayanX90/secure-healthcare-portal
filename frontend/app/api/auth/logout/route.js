import { logout } from "@/backend/controllers/authController";
export async function POST(req, context) {
  return logout(req, context);
}
