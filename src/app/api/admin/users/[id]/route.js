import { deleteUserHandler } from "@/backend/controllers/userController";

export async function DELETE(_request, { params }) {
  const { id } = await params;
  return deleteUserHandler(id);
}
