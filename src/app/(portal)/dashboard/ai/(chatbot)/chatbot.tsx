"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import botIcon from "/public/images/ai/bot.png";

export default function ChatBotCard() {
  const [isPaused, setIsPaused] = useState<boolean | null>(null);

  const handleToggle = async () => {
    const newValue = !isPaused;
    setIsPaused(newValue);

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "is-paused",
          value: newValue,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update config");
      }
    } catch (err) {
      console.error("Error updating pause status:", err);
      setIsPaused(!newValue);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/config?key=is-paused");
        const data = await res.json();

        if (data.error) {
          console.error("Error fetching config:", data.error);
        } else {
          setIsPaused(data.value);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchStatus();
  }, []);

  return (
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
            Test
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
          {isPaused === null ? (
            <div>Loading...</div>
          ) : (
            <Button
              variant={isPaused ? "default" : "destructive"}
              onClick={handleToggle}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
