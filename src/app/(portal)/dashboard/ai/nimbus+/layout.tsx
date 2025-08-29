"use client";

import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface NimbusLayoutProps {
  children: React.ReactNode;
}

export default function NimbusLayout({ children }: NimbusLayoutProps) {
  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-col bg-[#0a0a0a]">
      {children}
    </div>
  );
}

