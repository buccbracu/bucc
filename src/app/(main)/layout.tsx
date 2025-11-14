import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/navbar/announcement-bar";
import Navbar from "@/components/navbar/Navbar";
import EventBannerCarousel from "@/components/EventBannerCarousel";
import Providers from "@/util/Providers";
import type { Metadata } from "next";

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
    <>
      <Providers>
        <AnnouncementBar />
        <Navbar />
        <EventBannerCarousel />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </Providers>
    </>
  );
}
