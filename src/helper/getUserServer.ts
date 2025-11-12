//

import { authOptions } from "@/lib/auth-options";
import { getServerSession, User } from "next-auth";

export async function getUserServer(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  return session ? session.user : null;
}
