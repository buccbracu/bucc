"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getConfigValue, setConfigValue } from "@/client/appConfigClient";

export default function ChatBotStatus() {
  const [isPaused, setIsPaused] = useState<boolean | null>(null);

  const handleToggle = async () => {
    const newValue = !isPaused;
    setIsPaused(newValue); // Optimistic
    const success = await setConfigValue("is-paused", newValue);
    if (!success) setIsPaused(!newValue); // Rollback on failure
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const value = await getConfigValue<boolean>("is-paused");
      setIsPaused(value);
    };

    fetchStatus();
  }, []);

  return (
    <CardContent className="h-[20%] px-4">
      <div className="flex h-full items-center justify-between">
        <CardDescription className="text-sm text-yellow-900/70">
          {isPaused
            ? "⏸️ The bot is currently paused."
            : "⚠️ The bot is currently running."}
        </CardDescription>
        {/* {isPaused === null ? (
          <div className="rounded-full bg-black p-2">
            <Spinner />
          </div>
        ) : (
          <Button
            variant={isPaused ? "default" : "destructive"}
            onClick={handleToggle}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        )} */}
      </div>
    </CardContent>
  );
}
