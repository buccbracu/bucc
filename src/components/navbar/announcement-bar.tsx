"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { announcementData } from "@/constants/publicAnnouncement";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date(announcementData.dateOfFirstAppearance);
    const endDate = new Date(announcementData.dateOfLastAppearance);

    if (currentDate >= startDate && currentDate <= endDate) {
      const isDismissed = sessionStorage.getItem("announcementDismissed");
      if (!isDismissed) {
        setIsVisible(true);
      }
    }

    const resetDismissalOnClose = () => {
      sessionStorage.setItem("announcementDismissed", "false");
    };
    window.addEventListener("beforeunload", resetDismissalOnClose);

    return () => {
      window.removeEventListener("beforeunload", resetDismissalOnClose);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("announcementDismissed", "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`flex w-full items-center justify-center ${announcementData.color} px-6 py-3 ${announcementData.textColor} relative`}
    >
      <div className="flex flex-col items-center gap-2 text-center font-medium md:flex-row">
        {announcementData.message}{" "}
        {announcementData.buttonText && (
          <div className="flex justify-center">
            <Link
              href={announcementData.buttonLink}
              target="_blank"
              className={`flex items-center gap-2 ${announcementData.buttonTextColor} ${announcementData.buttonBgColor} rounded-md px-4 py-2 transition-colors ${announcementData.buttonHoverTextColor} ${announcementData.buttonHoverBgColor}`}
            >
              {announcementData.buttonText} <SquareArrowOutUpRight />
            </Link>
          </div>
        )}
      </div>
      <button
        onClick={handleClose}
        className={`${announcementData.closeButtonColor} absolute right-4 top-4`}
      >
        {announcementData.closeButton}
      </button>
    </div>
  );
};

export default AnnouncementBar;
