import { sendOtpHandler } from "@/backend/controllers/authController";
export async function POST(req, context) {
  return sendOtpHandler(req, context);
}
