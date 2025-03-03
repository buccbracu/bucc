import { z } from "zod";
import { passwordFieldSchema } from "./passwordSchema";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordFieldSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;
