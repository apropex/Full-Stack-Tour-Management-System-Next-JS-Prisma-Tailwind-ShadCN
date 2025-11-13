"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";

// Function overload signatures:
export function GetUserClient(): User | null;
export function GetUserClient<K extends keyof User>(key: K): User[K] | null;

// Actual implementation:
export function GetUserClient<K extends keyof User>(
  key?: K,
): User | User[K] | null {
  const { data: session } = useSession();
  if (!session || !session.user) return null;
  return key ? session.user[key] : session.user;
}
