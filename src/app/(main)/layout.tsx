import "@/app/globals.css";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/navbar/announcement-bar";
import Navbar from "@/components/navbar/Navbar";
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
      <body className={font.className}>
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <main className="relative min-h-[calc(100vh-140px)] overflow-auto">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
