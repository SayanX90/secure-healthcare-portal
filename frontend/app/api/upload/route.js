import { uploadHandler } from "@/backend/controllers/uploadController";
export async function POST(req, context) {
  return uploadHandler(req, context);
}
