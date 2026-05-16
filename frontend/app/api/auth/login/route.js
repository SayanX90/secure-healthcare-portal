import { login } from "@/backend/controllers/authController";

// API route entry file for POST /api/auth/login.
export async function POST(req, context) {
  return login(req, context);
}
