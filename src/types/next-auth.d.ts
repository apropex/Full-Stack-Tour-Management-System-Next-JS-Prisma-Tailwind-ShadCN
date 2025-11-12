import { DefaultSession } from "next-auth";

interface iAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    provider: string;
    phone: string;
    address: iAddress;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    provider: string;
    phone: string;
    address: iAddress;
  }
}
