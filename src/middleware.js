import { NextResponse } from "next/server";
import { AUTH_COOKIE, readToken } from "@/backend/utils/auth";

const guestPages = ["/login", "/signup", "/verify-otp"];
const userPages = ["/dashboard"];
const adminPages = ["/admin"];
const userApis = ["/api/dashboard"];
const adminApis = ["/api/admin", "/api/users"];

function isRoute(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function goTo(path, request, clearCookie = false) {
  const response = NextResponse.redirect(new URL(path, request.url));

  if (clearCookie) {
    response.cookies.delete(AUTH_COOKIE);
  }

  return response;
}

function apiError(message, status) {
  return NextResponse.json({ message }, { status });
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  let user = null;
  let hasBadToken = false;

  if (token) {
    user = await readToken(token);
    hasBadToken = !user;
  }

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  if (pathname === "/") {
    if (!isLoggedIn) {
      return goTo("/login", request, hasBadToken);
    }

    return goTo(isAdmin ? "/admin" : "/dashboard", request);
  }

  if (isRoute(pathname, userApis)) {
    if (hasBadToken) {
      return apiError("Session expired. Please login again.", 401);
    }

    if (!isLoggedIn) {
      return apiError("Authentication required.", 401);
    }
  }

  if (isRoute(pathname, adminApis)) {
    if (!isLoggedIn) {
      return apiError("Authentication required.", 401);
    }

    if (!isAdmin) {
      return apiError("Admin access required.", 403);
    }
  }

  if (guestPages.includes(pathname)) {
    if (hasBadToken) {
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE);
      return response;
    }

    if (isLoggedIn) {
      return goTo(isAdmin ? "/admin" : "/dashboard", request);
    }

    return NextResponse.next();
  }

  if (isRoute(pathname, userPages)) {
    if (!isLoggedIn) {
      return goTo(`/login?next=${encodeURIComponent(pathname)}`, request, hasBadToken);
    }

    if (isAdmin) {
      return goTo("/admin", request);
    }

    return NextResponse.next();
  }

  if (isRoute(pathname, adminPages)) {
    if (!isLoggedIn) {
      return goTo("/login", request, hasBadToken);
    }

    if (!isAdmin) {
      return goTo("/dashboard", request);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/verify-otp",
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/users/:path*",
    "/api/dashboard/:path*",
  ],
};
