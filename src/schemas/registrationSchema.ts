import { z } from "zod";

export const registrationSchema = z.object({
  studentId: z
    .string()
    .regex(/^[0-9]{8}$/, "Please enter a valid 8-digit student ID"),
  name: z.string().min(1, "Name is required"),
  semester: z.string().min(1, "Semester is required"),
  year: z
    .string()
    .regex(/^[0-9]{4}$/, "Year must be a 4-digit number")
    .refine(
      (val) =>
        parseInt(val, 10) >= 2000 &&
        parseInt(val, 10) <= new Date().getFullYear(),
      {
        message: "Year is required",
      },
    ),
  departmentBracu: z.string().min(1, "Department is required"),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/,
      "Please use a valid BRACU G-Suite email address",
    ),
});

export type RegistrationSchema = z.infer<typeof registrationSchema>;
