"use client";
import { useState } from "react";
import Heading from "@/components/portal/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import botIcon from "/public/images/ai/bot.png";

export default function AI() {
  const [isPaused, setIsPaused] = useState(false);

  const handleToggle = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <>
      <Heading
        headingText="Artificial Intelligence"
        subHeadingText="Configure AI-powered features of the web app."
      />
      <section className="mx-auto">
        <div className="mb-6 grid h-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="col-span-2 flex h-[300px] flex-col justify-between bg-blue-100">
            <CardHeader className="text-lg font-bold text-yellow-900">
              ChatBot
            </CardHeader>

            <div className="flex flex-1">
              <div className="flex w-1/2 items-center justify-center">
                <Image
                  src={botIcon}
                  alt="ChatBot"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>

              <div className="flex w-1/2 flex-col items-center justify-center gap-2">
                <Button variant="secondary" className="w-[120px]">
                  Train
                </Button>
                <Button variant="secondary" className="w-[120px]">
                  Test
                </Button>
                <Button variant="secondary" className="w-[120px]">
                  Deploy
                </Button>
              </div>
            </div>

            <CardContent className="h-[20%] px-4">
              <div className="flex h-full items-center justify-between">
                <CardDescription className="text-sm text-yellow-900/70">
                  {isPaused
                    ? "⏸️ The bot is currently paused."
                    : "⚠️ The bot is currently running."}
                </CardDescription>
                <Button
                  variant={isPaused ? "default" : "destructive"}
                  onClick={handleToggle}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                >
                  {isPaused ? "Resume" : "Pause"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
