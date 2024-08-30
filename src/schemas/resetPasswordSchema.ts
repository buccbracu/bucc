import { z } from "zod";

// Reset password schema
export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .regex(
        /^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/,
        "Please use a valid BRACU G-Suite email address",
      ),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Show error on confirmPassword field
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
