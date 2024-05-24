import "@/app/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/themeProvider";
import AuthProvider from "@/lib/AuthProvider";
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
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Toaster closeButton richColors />
            <Navbar />
            <main className="container relative min-h-[calc(100vh-140px)] overflow-auto">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
