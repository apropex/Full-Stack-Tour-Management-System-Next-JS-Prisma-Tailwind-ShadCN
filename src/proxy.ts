import { UserRoles } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserServer } from "./helper/getUserServer";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isEmailVerifyRoute,
  isPermittedToAdminDashboard,
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

  const user = await getUserServer();
  const role: UserRoles | null = user?.role || null;
  const isVerified: boolean | null = user?.isVerified ?? null;

  const owner = getRouteOwner(pathname);

  if (owner === null) return redirect("/");

  if (owner === "PUBLIC" || role === "SUPER_ADMIN") {
    return NextResponse.next();
  }

  if (isAuthRoute(pathname) && !isEmailVerifyRoute(pathname) && role) {
    return redirect(getDefaultDashboardRoute(role));
  }

  if (isEmailVerifyRoute(pathname)) {
    if (!isVerified) {
      if (!role) return redirect("/login");
      return NextResponse.next();
    } else return redirect(getDefaultDashboardRoute(role as UserRoles));
  }

  if (!role) return redirect("/login");
  if (!isVerified) return redirect("/email-verify");

  if (owner === "PROTECTED" || owner === "USER") return NextResponse.next();
  if (owner === "ADMIN" && isPermittedToAdminDashboard(role)) {
    return NextResponse.next();
  }

  return redirect("/unauthorized");
}

//
export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
