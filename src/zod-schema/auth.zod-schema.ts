//

import z from "zod";

export const loginZodSchema = z.object({
  email: z.email({ error: "Enter a valid email" }),
  password: z.string().trim().min(6, "Password must be at-least 6 characters"),
});

export const registerZodSchema = z.object({
  email: z.email({ error: "Enter a valid email" }),
  password: z
    .string({ error: "Password must be string type" })
    .trim()
    .min(6, "Password must be at-least 6 characters"),
  name: z.string().trim().min(3, "Name must be at-least 3 characters"),
  phone: z
    .string({ error: "Phone must be string type" })
    .trim()
    .min(10, "Enter a valid phone number"),
  street: z.string({ error: "Street must be string type" }).optional(),
  city: z.string({ error: "City must be string type" }).optional(),
  state: z.string({ error: "State must be string type" }).optional(),
  zip: z.string({ error: "ZIP must be string type" }).optional(),
});

export type iLoginCredentials = z.infer<typeof loginZodSchema>;
export type iRegisterValues = z.infer<typeof registerZodSchema>;

export interface iGoogleUserValues {
  name: string;
  email: string;
  avatar: string;
  provider: string;
  providerId: string;
  isVerified: boolean;
}
