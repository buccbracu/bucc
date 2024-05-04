"use client";

import { AlignJustify, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import Link from "next/link";
import { menus } from "./menus";

export default function ActionButtons() {
  const { setTheme } = useTheme();
  return (
    <div className="flex items-center">
      <div className="mr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="lg:hidden flex items-center justify-center w-[36px] h-[36px] border rounded-md shadow-sm ">
        <Sheet>
          <SheetTrigger>
            <AlignJustify />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <div className="flex flex-col space-y-4 items-start w-full text-lg mt-10">
                  {menus.map((menu, index) =>
                    menu.childrens ? (
                      <DropdownMenu key={index}>
                        <DropdownMenuTrigger asChild>
                          <p className="font-semibold cursor-pointer">
                            {menu.title}
                          </p>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {menu.childrens.map((child, index) => (
                            <DropdownMenuItem key={index}>
                              <Link href={child.path}>
                                <p>{child.title}</p>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link key={index} href={menu.path}>
                        <p className="font-semibold">{menu.title}</p>
                      </Link>
                    )
                  )}
                  <div className="md:hidden flex flex-col space-y-4 items-start w-full text-lg mt-10 font-semibold">
                    <Link href={"/login"}>
                      <p>Login</p>
                    </Link>
                    <Link href={"/registration"}>
                      <p>Register</p>
                    </Link>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:flex md:space-x-2 ml-2">
        <Button className="text-md" variant="outline">
          <Link href={"/login"}>Login</Link>
        </Button>
        <Button className="text-md bg-blue-500 hover:bg-blue-600 text-white dark:hover:bg-blue-600">
          <Link href={"/registration"}>Register</Link>
        </Button>
      </div>
    </div>
  );
}
