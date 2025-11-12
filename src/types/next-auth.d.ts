import { UserRoles } from "@prisma/client";
import { DefaultSession } from "next-auth";

interface iAddress {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: UserRoles;
    name: string;
    avatar: string | null;
    isVerified: boolean;
    provider?: string;
    phone: string | null;
    address?: iAddress;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: UserRoles;
    name: string;
    avatar: string | null;
    isVerified: boolean;
    provider?: string;
    phone: string | null;
    address?: iAddress;
  }
}
