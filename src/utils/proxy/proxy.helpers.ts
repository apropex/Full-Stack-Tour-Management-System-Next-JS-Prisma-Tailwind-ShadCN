//

import { UserRoles } from "@prisma/client";

export interface RouteConfig {
  paths: string[];
  patterns: RegExp[];
}

export const auth_routes = [
  "/login",
  "/register",
  "/forgot-password",
  "/email-verify",
];

export const protected_routes: RouteConfig = {
  paths: ["/my-profile", "/complaint", "/review"],
  patterns: [/^\/settings(\/|$)/, /^\/bookings(\/|$)/, /^\/payments(\/|$)/],
};

export const public_routes: RouteConfig = {
  paths: ["/", "/about", "/support", "/unauthorized"],
  patterns: [/^\/tour(\/|$)/],
};

export const isAuthRoute = (path: string): boolean => {
  return auth_routes.some((route: string) => route === path);
};

export const isProtectedRoute = (path: string): boolean => {
  const paths = protected_routes.paths.includes(path);
  const pattern = protected_routes.patterns.some((regex) => regex.test(path));
  return paths || pattern || false;
};

export const isPublicRoute = (path: string): boolean => {
  const paths = public_routes.paths.includes(path);
  const pattern = public_routes.patterns.some((regex) => regex.test(path));
  return paths || pattern || false;
};

export const getDefaultDashboardRoute = (role: UserRoles): string => {
  if (role === "USER") return "/";
  return "/dashboard";
};
