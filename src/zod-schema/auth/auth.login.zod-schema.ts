//

import z from "zod";

export const loginZodSchema = z.object({
  email: z.email({ error: "Enter a valid email" }),
  password: z.string().trim().min(6, "Password must be at-least 6 characters"),
});

export type iLoginCredentials = z.infer<typeof loginZodSchema>;
