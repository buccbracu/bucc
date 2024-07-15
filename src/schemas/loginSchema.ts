import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/,
      "Please use a valid BRACU G-Suite email address",
    ),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
