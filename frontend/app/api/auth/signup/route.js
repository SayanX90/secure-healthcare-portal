import { signup } from "@/backend/controllers/authController";
export async function POST(req, context) {
  return signup(req, context);
}
