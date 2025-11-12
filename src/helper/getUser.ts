import { User } from "next-auth";
import { useSession } from "next-auth/react";

//

export function GetUser(): User | null {
  const { data: session } = useSession();
  return session ? session.user : null;
}
