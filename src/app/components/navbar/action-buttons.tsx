"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { menus } from "./menus";

export default function ActionButtons() {
  const { setTheme } = useTheme();

  const [userSingedIn, setUserSingedIn] = useState(false);

  const handleUserSingedIn = () => {
    if (userSingedIn) {
      toast.success("Logout successful");
    } else {
      toast.success("Login successful");
    }
    setUserSingedIn(!userSingedIn);
  };

  const { username, profilePhoto } = {
    username: "Sabbir Bin Abdul Latif",
    profilePhoto: "https://avatars.githubusercontent.com/u/65303669?v=4",
  };

  const usernameFallback = username[0];

  return (
    <div className="flex items-center gap-2">
      <div>
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
                              <Link href={`${menu.path}${child.path}`}>
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
                  {userSingedIn ? null : (
                    <div className="md:hidden flex flex-col space-y-4 items-start w-full text-lg mt-10 font-semibold">
                      {/* <Link href={"/login"}>
                        <p>Login</p>
                      </Link> */}
                      <p onClick={handleUserSingedIn}>Login</p>
                      <Link href={"/registration"}>
                        <p>Register</p>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      {userSingedIn ? (
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-[36px] w-[36px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border shadow-sm">
                <AvatarImage alt={username} src={profilePhoto} />
                <AvatarFallback>{usernameFallback}</AvatarFallback>
                <span className="sr-only">Toggle user menu</span>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit mr-3">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <span className="font-bold">{username}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleUserSingedIn}
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="hidden md:flex md:space-x-2 ml-2">
          <Button className="text-md" variant="secondary">
            {/* <Link href={"/login"}>Login</Link> */}
            <p onClick={handleUserSingedIn}>Login</p>
          </Button>
          <Button className="text-md bg-blue-500 hover:bg-blue-600 text-white dark:hover:bg-blue-600">
            <Link href={"/registration"}>Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
