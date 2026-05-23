import { resendOtpHandler } from "@/backend/controllers/authController";
export async function POST(req, context) {
  return resendOtpHandler(req, context);
}
