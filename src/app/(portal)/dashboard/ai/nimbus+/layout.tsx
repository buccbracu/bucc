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
    <div className="flex h-[calc(100vh-0px)] w-full flex-col m-0 p-0">
      {children}
    </div>
  );
}

