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

import { logout } from "@/actions/logout";
import ThemeToggler from "@/components/theme-toggler";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { menus } from "./menus";

export default function ActionButtons() {
  const session = useSession();
  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const userSingedIn = session.data?.user;
  const { name, email, image, designation, buccDepartment } =
    session.data?.user || {};

  const usernameFallback = name ? name[0].toUpperCase() : "U";

  const handleUserLogOut = async () => {
    await logout();
    router.push("/");
    toast.success("Logout successful");
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeToggler />
      <div className="flex h-[36px] w-[36px] items-center justify-center rounded-md border shadow-sm lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger>
            <AlignJustify />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <div className="flex h-svh flex-col justify-between">
                  <div className="mt-10 flex w-full grow flex-col items-start space-y-4 text-lg">
                    {menus.map((menu, index) =>
                      menu.childrens ? (
                        <DropdownMenu key={index}>
                          <DropdownMenuTrigger asChild>
                            <p className="cursor-pointer font-semibold">
                              {menu.title}
                            </p>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {menu.childrens.map((child, index) => (
                              <DropdownMenuItem key={index}>
                                <Link
                                  onClick={() => {
                                    setIsSheetOpen(false);
                                  }}
                                  href={`${menu.path}${child.path}`}
                                >
                                  <p>{child.title}</p>
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          onClick={() => {
                            setIsSheetOpen(false);
                          }}
                          key={index}
                          href={menu.path}
                        >
                          <p className="font-semibold">{menu.title}</p>
                        </Link>
                      ),
                    )}
                  </div>
                  {userSingedIn ? null : (
                    <div className="mb-12 flex w-full flex-row items-center justify-center gap-2 text-lg font-semibold md:hidden">
                      <Button className="text-md w-full" variant="secondary">
                        <Link
                          onClick={() => {
                            setIsSheetOpen(false);
                          }}
                          href={"/login"}
                        >
                          Login
                        </Link>
                      </Button>
                      <Button className="text-md w-full bg-[#127cc1] text-white hover:bg-[#1f4864] dark:hover:bg-[#1f4864]">
                        <Link
                          onClick={() => {
                            setIsSheetOpen(false);
                          }}
                          href={"/registration"}
                        >
                          Register
                        </Link>
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
              <Avatar className="h-[36px] w-[36px] border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <AvatarImage alt={name} src={image} className="object-cover" />
                <AvatarFallback>{usernameFallback}</AvatarFallback>
                <span className="sr-only">Toggle user menu</span>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-3 w-fit">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <span className="my-1 font-bold">{name}</span>
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
                    onClick={handleUserLogOut}
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="ml-2 hidden md:flex md:space-x-2">
          <Button className="text-md" variant="secondary">
            <Link onClick={handleSheetClose} href={"/login"}>
              Login
            </Link>
          </Button>
          <Button className="text-md bg-[#127cc1] text-white hover:bg-[#1f4864] dark:hover:bg-[#1f4864]">
            <Link onClick={handleSheetClose} href={"/registration"}>
              Register
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
