import { verifyOtpHandler } from "@/backend/controllers/authController";
export async function POST(req, context) {
  return verifyOtpHandler(req, context);
}
