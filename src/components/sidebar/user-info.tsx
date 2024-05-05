"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { useEffect, useState } from "react";

const userInfoData = {
  username: "Sabbir Bin Abdul Latif",
  userEmail: "sabbir.bin.abdullatif@g.bracu.c.bd",
  profilePhoto: "",
};

const UserInfo = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { username, userEmail, profilePhoto } = userInfoData;
  const usernameFallback = username[0];

  return (
    <div className="flex items-center justify-between gap-2 border rounded-xl p-4">
      {isCollapsed ? (
        <Avatar className="h-[36px] w-[36px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border shadow-sm">
          <AvatarImage alt={username} src={profilePhoto} />
          <AvatarFallback>{usernameFallback}</AvatarFallback>
        </Avatar>
      ) : (
        <>
          <Avatar className="flex items-center space-x-4 h-[36px] w-[36px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border shadow-sm">
            <AvatarImage alt={username} src={profilePhoto} />
            <AvatarFallback>{usernameFallback}</AvatarFallback>
          </Avatar>

          <div className="grow">
            <p className="text-[16px] font-bold">{username}</p>
            <p className="text-[12px] text-neutral-500">{userEmail}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInfo;
