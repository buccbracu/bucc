"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (values: any) => {
  if (!values) {
    return { error: "Invalid fields!" };
  }
  const email = values.get("email");
  const password = values.get("password");
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credintails!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
