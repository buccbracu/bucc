import { z } from "zod";

export const passwordFieldSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter");

export const passwordSchema = z
  .object({
    password: passwordFieldSchema,
    newPassword: passwordFieldSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordSchema = z.infer<typeof passwordSchema>;
