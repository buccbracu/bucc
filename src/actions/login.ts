import { signIn } from "next-auth/react";

interface LoginValues {
  email: string;
  password: string;
}

export const login = async (values: LoginValues) => {
  const { email, password } = values;

  if (!email || !password) {
    return { error: "Both email and password are required!" };
  }

  try {
    const result = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard"
    });

    if (result?.error) {
      return { error: "Invalid credentials!" };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred" };
  }
};
