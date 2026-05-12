import { approveUserHandler } from "@/backend/controllers/userController";

export async function PATCH(_request, { params }) {
  const { id } = await params;
  return approveUserHandler(id);
}
