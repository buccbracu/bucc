"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import router from "next/router";

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
    });
    router.push("/dashboard");
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
