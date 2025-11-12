import { compare, genSalt, hash } from "bcryptjs";
import { env } from "./env";

export const bcrypt = {
  buildHash: async (password: string): Promise<string> => {
    const saltValue = Number(env("BCRYPT_SALT_VALUE"));

    if (!saltValue) return "";

    const salt = await genSalt(saltValue);
    return await hash(password, salt);
  },

  compare: async (password: string, hash: string): Promise<boolean> => {
    return await compare(password, hash);
  },
};
