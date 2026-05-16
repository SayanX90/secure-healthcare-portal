import { me } from "@/backend/controllers/authController";
export async function GET(req, context) {
  return me(req, context);
}
