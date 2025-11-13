import z from "zod";

export const PasswordZodType = z
  .string({ error: "Password is required" })
  .trim()
  .min(6, "Password must be at least 6 characters")
  .regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
    "Password must include at least one uppercase letter, one number, and one special character",
  );

export const ChangePasswordZodSchema_server = z.object({
  oldPassword: z.string({ error: "Password must be string type" }),
  newPassword: PasswordZodType,
});

export type iChangePasswordZodSchema_server = z.infer<
  typeof ChangePasswordZodSchema_server
>;
