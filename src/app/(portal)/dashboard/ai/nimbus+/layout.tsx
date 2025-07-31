"use client";

import { useEffect, useRef } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface NimbusLayoutProps {
  children: React.ReactNode;
}

export default function NimbusLayout({ children }: NimbusLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adjustLayout = () => {
      if (containerRef.current) {
        const main = containerRef.current.closest("main");
        if (main) {
          // Get the main element's position and dimensions
          const mainRect = main.getBoundingClientRect();
          const themeToggler = main.querySelector("[data-theme-toggler]");
          const themeTogglerHeight = themeToggler
            ? themeToggler.clientHeight
            : 0;

          // Calculate available height
          const availableHeight =
            window.innerHeight - mainRect.top - themeTogglerHeight;

          // Set main element to take full height
          main.style.height = `${availableHeight}px`;
          main.style.margin = "0";
          main.style.padding = "0";
          main.style.width = `${mainRect.width}px`;
          main.style.overflow = "hidden";

          // Position theme toggler absolutely
          if (themeToggler) {
            (themeToggler as HTMLElement).style.position = "absolute";
            (themeToggler as HTMLElement).style.zIndex = "50";
            (themeToggler as HTMLElement).style.top = "10px";
            (themeToggler as HTMLElement).style.right = "10px";
          }
        }
      }
    };

    adjustLayout();
    window.addEventListener("resize", adjustLayout);

    // Use a timeout to ensure the DOM is fully rendered
    const timeoutId = setTimeout(adjustLayout, 100);

    return () => {
      window.removeEventListener("resize", adjustLayout);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${outfit.className} relative h-full w-full`}
    >
      {children}
    </div>
  );
}
