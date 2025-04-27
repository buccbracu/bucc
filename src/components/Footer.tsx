"use client";

import { buccSocials } from "@/constants/buccInfo";
import {
  ArrowUp,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { menus } from "./navbar/menus";
import BUCCLogo from "/public/assets/bucc-logo.svg";

const navbar_menus_paths = menus
  .map((menu) => {
    if (menu.childrens) {
      return menu.childrens.map((child) => child.path);
    }
    return menu.path;
  })
  .flat(1);

const footer_menu = [
  {
    title: "Quick Links",
    childrens: [
      { title: "About Us", path: "/about" },
      { title: "Events", path: "/events" },
      { title: "Gallery", path: "/gallery" },
      { title: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Publications",
    childrens: [
      { title: "Press Releases", path: "/press-releases" },
      { title: "Blogs", path: "/blogs" },
      { title: "Newsletters", path: "/newsletters" },
      { title: "Magazine", path: "/magazine" },
    ],
  },
  {
    title: "Legal",
    childrens: [
      { title: "Terms of Use", path: "/tou" },
      { title: "Privacy Policy", path: "/about/privacy-policy" },
      { title: "Cookie Policy", path: "/cookie-policy" },
    ],
  },
];

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!navbar_menus_paths.includes(path)) {
    return (
      <div className="h-[55px] border-t py-4 dark:border-gray-700">
        <div className="container flex flex-col items-center justify-between gap-2 pb-3 md:flex-row">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="text-blue-500 dark:text-blue-400">
              &copy; BUCC
            </Link>{" "}
            {new Date().getFullYear()} - All rights reserved
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ by{" "}
            <a
              href="/about/bucc-web-team"
              className="text-blue-500 dark:text-blue-400"
            >
              BUCC R&D Web Team 2024
            </a>
          </div>
          <div className="hidden md:block">
            <a
              href="/about/privacy-policy"
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Privacy Policy
            </a>

            <a
              href="/about/terms-of-service"
              className="ml-4 text-sm text-gray-500 dark:text-gray-400"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="relative z-10 py-8 md:px-24 md:py-10">
        <footer className="footer text-base-content mt-4 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <aside className="space-y-8">
            <div>
              <div className="text-center md:text-left">
                <Image
                  className="mx-auto cursor-pointer object-center dark:brightness-0 dark:grayscale dark:invert dark:filter md:mx-0"
                  src={BUCCLogo}
                  alt="BUCC Logo"
                  width={250}
                  height={120}
                />
              </div>
              <div className="my-4 text-center md:text-left">
                <p className="mb-1">
                  <strong>Contact Number:</strong> +8801756020067
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> 
                </p>
                <p className="mb-1">
                  <strong>For Business:</strong> marketing.bucc@g.bracu.ac.bd
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> Kha 226, Bir Uttam Rafiqul Islam
                  Ave,
                  <br />
                  Badda, Dhaka 1212
                </p>
              </div>
              <div className="flex justify-center gap-3 md:justify-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900/20 p-2">
                  <Link href={buccSocials.facebook} target="_blank">
                    <Facebook size={20} />
                  </Link>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900/20 p-2">
                  <Link href={buccSocials.linkedin} target="_blank">
                    <Linkedin size={20} />
                  </Link>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900/20 p-2">
                  <Link href={buccSocials.instagram} target="_blank">
                    <Instagram size={20} />
                  </Link>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900/20 p-2">
                  <Link href={buccSocials.youtube} target="_blank">
                    <Youtube size={20} />
                  </Link>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900/20 p-2">
                  <Link href={buccSocials.github} target="_blank">
                    <Github size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {footer_menu.map((menu, index) => (
            <nav key={index} className="space-y-4 text-center md:text-right">
              <h6 className="text-xl font-bold uppercase">{menu.title}</h6>
              {menu.childrens.map((child, idx) => (
                <Link
                  key={idx}
                  href={child.path}
                  className="block transition duration-300 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  {child.title}
                </Link>
              ))}
            </nav>
          ))}
        </footer>
      </div>
      <div className="footer footer-center pb-6 pt-10 text-center md:p-5 md:pb-6">
        <aside>
          <p className="text-sm text-muted-foreground">
            &copy; BUCC {new Date().getFullYear()} - All rights reserved | Made
            with ❤️ by BUCC R&D
          </p>
        </aside>
      </div>
      {showScroll && (
        <div
          className="fixed bottom-20 right-4 z-30 cursor-pointer rounded-full bg-blue-900/80 p-2 text-white dark:bg-gray-600 dark:text-gray-300"
          onClick={scrollTop}
        >
          <ArrowUp />
        </div>
      )}
      <div className="absolute inset-0 z-0 flex items-end justify-center overflow-clip opacity-10 md:items-center">
        <h1 className="text-[45vw] font-extrabold text-gray-400 dark:text-gray-600 md:text-[55vw]">
          BUCC
        </h1>
      </div>
    </div>
  );
};

export default Footer;
