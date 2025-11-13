import { UserRoles } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserServer } from "./helper/getUserServer";
import {
  getDefaultDashboardRoute,
  isAuthRoute,
  isProtectedRoute,
  isPublicRoute,
} from "./utils/proxy/proxy.helpers";

const unauthorized = "/unauthorized";

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("dest", pathname);
  const redirect = (url: string) => {
    if (url === "/login") return NextResponse.redirect(loginUrl);
    return NextResponse.redirect(new URL(url, request.url));
  };

  // ========================== //

  const user = await getUserServer();
  const role: UserRoles | null = user?.role || null;
  const isVerified: boolean | null = user?.isVerified ?? null;

  if (isAuthRoute(pathname) && pathname !== "/email-verify" && role) {
    return redirect(getDefaultDashboardRoute(role));
  }

  if (pathname === "/email-verify" && isVerified) {
    return redirect(getDefaultDashboardRoute(role as UserRoles));
  }

  if (role === "USER" && pathname.startsWith("/dashboard")) {
    return redirect(unauthorized);
  }

  if (isProtectedRoute(pathname) && !role) {
    return redirect("/login");
  }

  if (isProtectedRoute(pathname) && role) {
    if (!isVerified) {
      const verifyUrl = new URL("/email-verify", request.url);
      verifyUrl.searchParams.set("email", user?.email || "");
      return NextResponse.redirect(verifyUrl);
    }
  }

  if (isPublicRoute(pathname)) return NextResponse.next();

  return redirect("/");
}

//
export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
