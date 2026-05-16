import { cookies } from "next/headers";
import { AUTH_COOKIE, readToken } from "@/backend/utils/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return readToken(token);
}
