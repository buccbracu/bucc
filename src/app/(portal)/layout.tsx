import "@/app/globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import ThemeToggler from "@/components/theme-toggler";
import { ThemeProvider } from "@/components/themeProvider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";

const font = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BRAC University Computer Club | Upgrade Yourself",
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/assets/bucc-favicon.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/assets/bucc-favicon-light.ico",
      media: "(prefers-color-scheme: dark)",
    },
  ],
  description:
    "BRAC University Computer Club (BUCC) is the oldest club of BRAC university founded in 2001.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex items-start justify-between ${font.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster closeButton richColors />
          <Sidebar />

          <main className="w-full min-h-screen flex justify-center items-center">
            <div className="absolute top-3 right-3">
              <ThemeToggler />
            </div>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
