import "@/app/globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import ThemeToggler from "@/components/theme-toggler";
import Providers from "@/util/Providers";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";

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
        <Providers>
          <Sidebar />
          <main className="w-full min-h-screen m-10 overflow-clip">
            <div className="absolute top-3 right-3">
              <ThemeToggler />
            </div>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
