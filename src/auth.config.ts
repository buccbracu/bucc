import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    error: "/",
    signIn: "/",
    signOut: "/",
  },
  providers: [],
} satisfies NextAuthConfig;
