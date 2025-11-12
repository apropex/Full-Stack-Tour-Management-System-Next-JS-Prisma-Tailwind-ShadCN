import { UserRoles } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserServer } from "./helper/getUserServer";
import {
  getDefaultDashboardRoute,
  isAuthRoute,
  isProtectedRoute,
} from "./utils/proxy/proxy.helpers";

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("dest", pathname);
  const redirect = (url: string) => {
    if (url === "/login") return NextResponse.redirect(loginUrl);
    return NextResponse.redirect(new URL(url, request.url));
  };

  // ========================== //

  const role: UserRoles | null = (await getUserServer())?.role || null;

  if (isAuthRoute(pathname) && role) {
    return redirect(getDefaultDashboardRoute(role));
  }

  if (role === "USER" && pathname.startsWith("/dashboard")) {
    return redirect("/unauthorized");
  }

  if (isProtectedRoute(pathname) && !role) {
    return redirect("/login");
  }

  NextResponse.next();
}

//
export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
