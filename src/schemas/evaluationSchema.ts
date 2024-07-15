import { z } from "zod";

export const evaluationSchema = z.object({
  studentID: z
    .string()
    .regex(/^[0-9]{8}$/, "Please enter a valid 8-digit student ID"),
});
