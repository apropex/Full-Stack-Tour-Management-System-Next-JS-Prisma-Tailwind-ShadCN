//

import { UserRoles } from "@prisma/client";

export interface RouteConfig {
  paths: string[];
  patterns: RegExp[];
}

export interface iRoutes {
  public: RouteConfig;
  protected: RouteConfig;
  userDashboard: RouteConfig;
  adminDashboard: RouteConfig;
}

export const auth_routes = [
  "/login",
  "/register",
  "/forgot-password",
  "/email-verify",
];

export const routes: iRoutes = {
  public: {
    paths: ["/", "/about", "/review", "/support", "/unauthorized"],
    patterns: [/^\/tour(\/|$)/],
  },
  protected: {
    paths: ["/tour-review", "/complaint", "/my-profile"],
    patterns: [/^\/settings(\/|$)/],
  },
  userDashboard: {
    paths: [],
    patterns: [/^\/dashboard(\/|$)/],
  },
  adminDashboard: {
    paths: [],
    patterns: [/^\/admin(\/|$)/],
  },
};

export const isAuthRoute = (path: string): boolean => {
  return auth_routes.some((route: string) => route === path);
};

export const isValidRoute = (routes: RouteConfig, path: string): boolean => {
  const exact = routes.paths.includes(path);
  const pattern = routes.patterns.some((regex) => regex.test(path));
  return exact || pattern || false;
};

export const getRouteOwner = (
  path: string,
): UserRoles | "PROTECTED" | "PUBLIC" | null => {
  if (isValidRoute(routes.adminDashboard, path)) return "ADMIN";
  if (isValidRoute(routes.protected, path)) return "PROTECTED";
  if (isValidRoute(routes.userDashboard, path)) return "USER";
  if (isValidRoute(routes.public, path)) return "PUBLIC";
  return null;
};

export const isEmailVerifyRoute = (path: string): boolean => {
  return path === "/email-verify";
};

export const getDefaultDashboardRoute = (role: UserRoles): string => {
  if (!role) return "/";
  if (role === "USER") return "/dashboard";
  return "/admin/dashboard";
};

export const isPermittedToAdminDashboard = (
  role: UserRoles | null,
): boolean => {
  if (!role) return false;
  return (
    [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
      UserRoles.GUIDE,
      UserRoles.MODERATOR,
    ] as UserRoles[]
  ).includes(role);
};
