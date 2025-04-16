"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroBanner from "/public/images/homepage/Executive Body 2025.jpeg";

export default function Hero() {
  const videoId = "UpPdA9WClQ4";

  return (
    <section className="w-full py-8 lg:py-12">
      <div className="container flex flex-col items-center justify-center space-y-8 px-4 text-center md:px-6">
        <div className="max-w-4xl space-y-4">
          <h1 className="bg-gradient-to-r from-[#1f4864] to-[#127cc1] bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            BRAC University Computer Club
          </h1>
          <p className="text-lg text-gray-900 dark:text-gray-200 md:text-xl">
            A community for tech enthusiasts from BRAC University, where we
            explore the latest advancements in computer science and technology.
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <Link
            href="/registration"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#127cc1] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#1f4864] disabled:pointer-events-none disabled:opacity-50"
          >
            Join the Club
          </Link>
          <Link
            href="/about/about-us"
            className="inline-flex h-12 items-center justify-center rounded-md border border-[#127cc1] bg-white px-8 text-sm font-medium text-[#127cc1] shadow transition-colors hover:bg-[#127cc1] hover:text-white disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:text-[#127cc1] dark:hover:bg-white dark:hover:text-[#127cc1]"
          >
            Learn More
          </Link>
        </div>
        <div className="relative w-full max-w-5xl overflow-hidden rounded-xl">
          <div className="relative">
            <Image
              src={heroBanner}
              alt="BRAC University Computer Club Executive Board 2024 Group Photo"
              className="h-auto w-full rounded-xl object-cover"
              width={1200}
              height={675}
              placeholder="blur"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <button
                className="rounded-full bg-[#127cc1]/30 p-4 text-[#127cc1]/30 backdrop-blur-md backdrop-filter"
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${videoId}`,
                    "_blank",
                  )
                }
              >
                <Play size={60} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}