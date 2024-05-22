"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlignJustify } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import ThemeToggler from "@/components/theme-toggler";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { menus } from "./menus";

export default function ActionButtons() {
  const [userSingedIn, setUserSingedIn] = useState(false);
  const router = useRouter();
  const handleUserSingedIn = () => {
    if (userSingedIn) {
      router.push("/");
      toast.success("Logout successful");
    } else {
      router.push("/dashboard");
      toast.success("Login successful");
    }
    setUserSingedIn(!userSingedIn);
  };

  const { username, userEmail, profilePhoto } = {
    // TODO: Replace with actual user data from the session
    username: "Sabbir Bin Abdul Latif",
    userEmail: "sabbir.bin.abdullatif@g.bracu.c.bd",
    profilePhoto: "https://avatars.githubusercontent.com/u/65303669?v=4",
  };

  const usernameFallback = username[0];

  return (
    <div className="flex items-center gap-2">
      <ThemeToggler />
      <div className="lg:hidden flex items-center justify-center w-[36px] h-[36px] border rounded-md shadow-sm ">
        <Sheet>
          <SheetTrigger>
            <AlignJustify />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <div className="flex flex-col justify-between h-svh">
                  <div className="flex flex-col space-y-4 items-start w-full text-lg mt-10 grow">
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
                  </div>
                  {userSingedIn ? null : (
                    <div className="md:hidden flex flex-row gap-2 items-center justify-center w-full text-lg mb-12 font-semibold">
                      <Button className="text-md w-full" variant="secondary">
                        {/* <Link href={"/login"}>Login</Link> */}
                        <p onClick={handleUserSingedIn}>Login</p>
                      </Button>
                      <Button className="text-md w-full bg-blue-500 hover:bg-blue-600 text-white dark:hover:bg-blue-600">
                        <Link href={"/registration"}>Register</Link>
                      </Button>
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
                  <span className="font-bold my-1">{username}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
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
