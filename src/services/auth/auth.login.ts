"use server";

import prisma from "@/lib/prisma";
import { bcrypt } from "@/utils/bcrypt";
import { throwError } from "@/utils/throwError";
import {
  iLoginCredentials,
  loginZodSchema,
} from "@/zod-schema/auth/auth.login.zod-schema";
import { User } from "@prisma/client";

export const login = async (credentials: iLoginCredentials): Promise<User> => {
  try {
    const validation = loginZodSchema.safeParse(credentials);
    if (!validation.success) throwError("Enter valid email and password");

    const { email, password } = validation.data as iLoginCredentials;

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    if (!user) throwError("User does not exist with this email");

    const isValid = await bcrypt.compare(password, user.password || "");

    if (!isValid) throwError("Invalid credentials");

    return user;
  } catch (error) {
    console.error("login error:", error);
    throw error;
  }
};
