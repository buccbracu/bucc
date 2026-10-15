"use client";

import { authClient } from "@/lib/auth-client";

export function useSession(): any {
  // Return dummy session during build/server-render
  if (typeof window === 'undefined') {
    return { data: null, error: null, status: "loading", update: async () => null };
  }

  try {
    const session = authClient.useSession();
    if (!session) {
      return { data: null, error: null, status: "unauthenticated", update: async () => null };
    }
    
    const { data, isPending, error } = session;

    return {
      data,
      error,
      status: isPending ? "loading" : data ? "authenticated" : "unauthenticated",
      update: async () => {
        try {
          if (session.refetch) {
            await session.refetch();
          }
          const fresh = await authClient.getSession();
          return fresh?.data || data;
        } catch {
          return data;
        }
      },
    };
  } catch (e) {
    // Catch any useContext errors from Better Auth client during SSG
    return { data: null, error: null, status: "loading", update: async () => null };
  }
}

export async function signIn(
  provider: string,
  options?: { email?: string; password?: string; redirect?: boolean },
) {
  if (provider !== "credentials" || !options?.email || !options?.password) {
    return { error: "Unsupported sign-in provider" };
  }

  const { error } = await authClient.signIn.email({
    email: options.email,
    password: options.password,
  });

  return error ? { error: error.message } : { ok: true };
}
