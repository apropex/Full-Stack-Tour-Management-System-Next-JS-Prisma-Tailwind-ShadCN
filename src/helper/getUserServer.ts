import { authOptions } from "@/lib/auth-options";
import { getServerSession, User } from "next-auth";

// Overload signatures
export async function getUserServer(): Promise<User | null>;
export async function getUserServer<K extends keyof User>(
  key: K,
): Promise<User[K] | null>;

// Implementation
export async function getUserServer<K extends keyof User>(
  key?: K,
): Promise<User | User[K] | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;
  if (!key) return session.user;
  return session.user[key];
}
