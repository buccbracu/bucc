"use client";

import { logout } from "@/actions/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const UserInfo = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const session = useSession();
  const userSingedIn = session.data?.user;
  const { name, email, image, designation, buccDepartment } =
    session.data?.user || {};
  const router = useRouter();
  const handleUserLogOut = async () => {
    await logout();
    router.push("/");
    toast.success("Logout successful");
  };

  const usernameFallback = name ? name[0].toUpperCase() : "U";

  return (
    <div className="flex items-center justify-between gap-2 border rounded-xl p-4">
      {isCollapsed ? (
        <div className="flex items-center cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-[36px] w-[36px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border shadow-sm">
                <AvatarImage alt={name} src={image} />
                <AvatarFallback>{usernameFallback}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit ml-3 mt-4">
              <DropdownMenuGroup>
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
        <div className="flex items-center cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2">
                <Avatar className="flex items-center space-x-4 h-[36px] w-[36px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border shadow-sm">
                  <AvatarImage alt={name} src={image} />
                  <AvatarFallback>{usernameFallback}</AvatarFallback>
                </Avatar>

                <div className="grow">
                  <p className="text-[16px] font-bold">{name}</p>
                  <p className="text-[12px] text-neutral-500">{email}</p>
                </div>
                <span className="sr-only">Toggle user menu</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit mt-4">
              <DropdownMenuGroup>
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
      )}
    </div>
  );
};

export default UserInfo;
