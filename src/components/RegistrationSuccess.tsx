"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buccSocials, intakeInfo } from "@/constants/buccInfo";
import confettiData from "@/lottie/confetti.json";
import Lottie from "lottie-react";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export default function RegistrationSuccess() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      {showConfetti && (
        <div id="confetti">
          <Lottie
            className="absolute left-0 top-0 h-full w-full"
            animationData={confettiData}
            loop={false}
            onComplete={() => {
              setShowConfetti(false);
            }}
          />
        </div>
      )}
      <Card className="z-10 w-full max-w-lg space-y-6 p-8">
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
                  Please make sure to fill up the{" "}
                  <strong className="text-[#127cc1]">
                    <Link href="/evaluation">Written Evaluation Form</Link>
                  </strong>{" "}
                  before attending for interview.
                </span>
              )}{" "}
              Keep an eye on your email and our{" "}
              <strong className="text-[#127cc1]">
                <Link href={buccSocials.facebook}>Facebook page</Link>
              </strong>{" "}
              for further updates.
            </p>
          </div>
        </CardContent>

        <div className="flex gap-2">
          {intakeInfo.isEvaluationActive && (
            <Button
              className="w-full bg-[#127cc1] text-white hover:bg-[#1f4864]"
              onClick={() => router.push("/evaluation")}
            >
              Fill Evaluation Form
            </Button>
          )}
          <Button className="w-full" onClick={() => router.push("/")}>
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
