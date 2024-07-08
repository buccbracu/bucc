"use client";

import { buccSocials } from "@/constants/buccInfo";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface IntakeInactiveProps {
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (endDate: string): TimeLeft => {
  const difference = +new Date(endDate) - +new Date();
  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default function IntakeInactive({ endDate }: IntakeInactiveProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(endDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const hasRecruitmentStarted = +new Date(endDate) - +new Date() <= 0;

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <Card className="w-1/3 px-6">
        <CardHeader className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-blue-500/20 p-6">
            <TriangleAlert className="h-16 w-16 text-blue-500" />
          </div>
        </CardHeader>

        <CardContent className="items-center justify-center text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Recruitment is Currently Inactive
          </h3>
          {hasRecruitmentStarted ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Wait till the next recruitment of next semester. Please keep an
              eye on our{" "}
              <Link href={buccSocials.facebook} className="text-blue-500">
                Facebook page
              </Link>{" "}
              for updates.
            </p>
          ) : (
            <>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Recruitment will start in
              </p>
              <div className="mt-4 flex justify-center space-x-4 text-blue-500">
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.days || 0}
                  </span>
                  <span className="text-gray-500">Days</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.hours || 0}
                  </span>
                  <span className="text-gray-500">Hours</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.minutes || 0}
                  </span>
                  <span className="text-gray-500">Minutes</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.seconds || 0}
                  </span>
                  <span className="text-gray-500">Seconds</span>
                </div>
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
