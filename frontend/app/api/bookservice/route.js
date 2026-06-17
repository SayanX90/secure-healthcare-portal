import { createBookServiceHandler } from "@/backend/controllers/bookServiceController";

// Route entry file for POST /api/bookservice.
export async function POST(req) {
  return createBookServiceHandler(req);
}
