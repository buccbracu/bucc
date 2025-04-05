"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buccSocials, intakeInfo } from "@/constants/buccInfo";
import confettiData from "@/lottie/confetti.json";
import Lottie from "lottie-react";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export default function RegistrationSuccess() {
  const router = useRouter();
  const confettiRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Cleanup function to remove the component on unmount if needed
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      {isMounted && (
        <div id="confetti" ref={confettiRef}>
          <Lottie
            className="absolute left-0 top-0 h-full w-full"
            animationData={confettiData}
            loop={false}
            onComplete={() => {
              // Using the ref instead of document.getElementById
              if (confettiRef.current) {
                confettiRef.current.style.display = "none";
              }
            }}
          />
        </div>
      )}
      <Card className="w-full max-w-lg space-y-6 p-8">
        <CardHeader className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-green-500/20 p-6">
            <CircleCheckBig className="h-16 w-16 text-green-500" />
          </div>
        </CardHeader>

        <CardContent className="items-center justify-center text-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Pre Registration Successful!
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You have successfully registered for {intakeInfo.intakeName}.
              {intakeInfo.isEvaluationActive && (
                <span>
                  Please make sure to fill up the
                  <strong className="text-[#127cc1]">
                    <Link href={"/evaluation"}> Written Evaluation Form</Link>
                  </strong>{" "}
                  before attending for interview.
                </span>
              )}{" "}
              Keep an eye on your email and our
              <strong className="text-[#127cc1]">
                {" "}
                <Link href={buccSocials.facebook}>Facebook page</Link>
              </strong>{" "}
              for further updates.
            </p>
          </div>
        </CardContent>
        <div className="flex gap-2">
          {intakeInfo.isEvaluationActive && (
            <Button
              className="w-full rounded-md bg-[#127cc1] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1f4864] dark:bg-[#127cc1] dark:text-white dark:hover:bg-[#1f4864]"
              onClick={() => router.push("/evaluation")}
            >
              Fill Evaluation Form
            </Button>
          )}
          <Button
            className="w-full rounded-md px-4 py-2 font-medium"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
