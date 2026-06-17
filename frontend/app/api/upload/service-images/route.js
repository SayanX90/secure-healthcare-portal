import { uploadServiceImagesHandler } from "@/backend/controllers/bookServiceController";

// Route entry file for POST /api/upload/service-images.
export async function POST(req) {
  return uploadServiceImagesHandler(req);
}
