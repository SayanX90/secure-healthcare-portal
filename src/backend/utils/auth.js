import { jwtVerify, SignJWT } from "jose";

export const AUTH_COOKIE = "auth_token";

const secret = process.env.JWT_SECRET || "development-secret-change-me";
const secretKey = new TextEncoder().encode(secret);

export async function createToken(user) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d") // JWT itself expires in 1d max
    .sign(secretKey);
}

export async function readToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

// Always a session cookie — no maxAge, no expires.
// Cookie is deleted automatically when the browser fully closes.
export function cookieSettings() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };
}

export function cleanUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isApproved: user.isApproved,
  };
}
