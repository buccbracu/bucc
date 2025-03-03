"use client";

import { useEffect, useState } from "react";
import { SideNav } from "./side-nav";

type Props = {};

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useWindowWidth } from "@react-hook/window-size";
import Link from "next/link";
import menus from "./menus";
import UserInfo from "./user-info";

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="sticky top-0 flex h-screen min-w-fit flex-col items-center border-r p-3">
      <UserInfo isCollapsed={mobileWidth ? true : isCollapsed} />

      {!mobileWidth && (
        <div className="absolute right-[-20px] top-[48%]">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-full p-2"
          >
            {isCollapsed ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </Button>
        </div>
      )}
      <div className="w-full grow">
        <SideNav isCollapsed={mobileWidth ? true : isCollapsed} menus={menus} />
      </div>
      {!isCollapsed && (
        <div className="hidden text-center text-sm text-gray-400 dark:text-gray-600 md:block">
          <Link href="/" className="text-blue-400 dark:text-blue-600/60">
            BUCC
          </Link>{" "}
          &copy; {new Date().getFullYear()} | All rights reserved.
        </div>
      )}
    </div>
  );
}
