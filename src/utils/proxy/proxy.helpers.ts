//

import { UserRoles } from "@prisma/client";

export interface RouteConfig {
  paths: string[];
  patterns: RegExp[];
}

export const auth_routes = ["/login", "/register", "/forgot-password"];

export const protected_routes: RouteConfig = {
  paths: ["/my-profile"],
  patterns: [/^\/settings(\/|$)/],
};

export const isAuthRoute = (path: string): boolean => {
  return auth_routes.some((route: string) => route === path);
};

export const isProtectedRoute = (path: string): boolean => {
  const paths = protected_routes.paths.includes(path);
  const pattern = protected_routes.patterns.some((regex) => regex.test(path));
  return paths || pattern || false;
};

export const getDefaultDashboardRoute = (role: UserRoles): string => {
  if (role === "USER") return "/";
  return "/dashboard";
};
