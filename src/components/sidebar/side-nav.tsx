"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface NavProps {
  isCollapsed: boolean;
  menus: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant?: string;
    path: string;
    access_department: string[];
    access_designation: string[];
  }[];
}

export function SideNav({ menus, isCollapsed }: NavProps) {
  const pathName = usePathname();
  const session = useSession();

  const { designation, buccDepartment } = session.data?.user || {};

  const filteredMenus = menus.filter((menu) => {
    const userDepartment = buccDepartment;
    const userDesignation = designation;

    const isDepartmentMatch =
      !menu.access_department ||
      menu.access_department.map((dept) => dept).includes(userDepartment || "");

    const isDesignationMatch =
      !menu.access_designation ||
      menu.access_designation
        .map((desig) => desig)
        .includes(userDesignation || "");

    return isDepartmentMatch && isDesignationMatch;
  });

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {filteredMenus.map((menu, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={menu.path}
                  className={cn(
                    buttonVariants({
                      variant: menu.path === pathName ? "default" : "ghost",
                      size: "icon",
                    }),
                    "h-9 w-9",
                    menu.variant === "default",
                  )}
                >
                  <menu.icon className="h-4 w-4" />
                  <span className="sr-only">{menu.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {menu.title}
                {menu.label && (
                  <span className="ml-auto text-muted-foreground">
                    {menu.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={menu.path}
              className={cn(
                buttonVariants({
                  variant: menu.path === pathName ? "default" : "ghost",
                  size: "sm",
                }),
                menu.variant === "default",
                "justify-start",
              )}
            >
              <menu.icon className="mr-2 h-4 w-4" />
              {menu.title}
              {menu.label && (
                <span className={cn("ml-auto", menu.variant === "default")}>
                  {menu.label}
                </span>
              )}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
