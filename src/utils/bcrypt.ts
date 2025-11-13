import { ENV } from "@/lib/config/env";
import { compare, genSalt, hash } from "bcryptjs";

export const bcrypt = {
  buildHash: async (password: string): Promise<string> => {
    const saltValue = ENV.BCRYPT_SALT_ROUND;

    if (!saltValue) return "";

    const salt = await genSalt(saltValue);
    return await hash(password, salt);
  },

  compare: async (password: string, hash: string): Promise<boolean> => {
    return await compare(password, hash);
  },
};
