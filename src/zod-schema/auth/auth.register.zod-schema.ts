//

import { Gender } from "@prisma/client";
import z from "zod";
import { PasswordZodType } from "./auth.password.zod-schema";

export const registerZodSchema_server = z.object({
  email: z.string().email("Enter a valid email"),
  password: PasswordZodType,
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  phone: z
    .string({ error: "Phone is required" })
    .trim()
    .min(10, "Enter a valid phone number"),
  gender: z.enum(Object.values(Gender) as [string, ...string[]], {
    message: "Enter a valid gender",
  }),
  dob: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

export type iRegisterValues = z.infer<typeof registerZodSchema_server>;

export interface iGoogleUserValues {
  name: string;
  email: string;
  avatar: string;
  provider: string;
  providerId: string;
  isVerified: boolean;
}
