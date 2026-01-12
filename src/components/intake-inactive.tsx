"use client";

import { buccSocials } from "@/constants/buccInfo";
import { useIntakeInfo } from "@/hooks/useIntakeInfo";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface IntakeInactiveProps {
  startDate: string;
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: string): TimeLeft => {
  const difference = +new Date(targetDate) - +new Date();
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export default function IntakeInactive() {
  const router = useRouter();
  const { intakeInfo } = useIntakeInfo();
  const startDate = intakeInfo?.intakeStartDate || "";
  const endDate = intakeInfo?.intakeEndDate || "";
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Set hasMounted to true on client-side only
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(startDate));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startDate, hasMounted]);

  const hasRecruitmentStarted = hasMounted && new Date() >= new Date(startDate);

  if (!hasMounted) {
    return null; // Render nothing on the server
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <Card className="w-full px-6 md:w-1/3">
        <CardHeader className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-blue-500/20 p-6">
            <TriangleAlert className="h-16 w-16 text-[#127cc1]" />
          </div>
        </CardHeader>

        <CardContent className="items-center justify-center text-center">
          <h3 className="text-xl font-bold text-[#127cc1] dark:text-gray-100">
            Recruitment is Currently Inactive
          </h3>
          {hasRecruitmentStarted ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Wait till the next recruitment of next semester. Please keep an
              eye on our{" "}
              <Link href={buccSocials.facebook} className="text-[#127cc1]">
                Facebook page
              </Link>{" "}
              for updates.
            </p>
          ) : (
            <>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Recruitment will start in
              </p>
              <div className="mt-4 flex justify-center space-x-4 text-[#127cc1]">
                {["Days", "Hours", "Minutes", "Seconds"].map((label, idx) => (
                  <div key={label} className="text-center">
                    <span className="block text-2xl font-bold">
                      {[
                        timeLeft.days,
                        timeLeft.hours,
                        timeLeft.minutes,
                        timeLeft.seconds,
                      ][idx] || 0}
                    </span>
                    <span className="text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full rounded-md px-4 py-2 font-medium"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
