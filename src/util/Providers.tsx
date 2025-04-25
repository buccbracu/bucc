"use client";

import { ThemeProvider } from "@/components/themeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import SyncSessionWithUserProvider from "./SyncSession";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({});
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster closeButton richColors />
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <UserProvider>
              <SyncSessionWithUserProvider />
              {children}
              
            </UserProvider>
          </SessionProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
