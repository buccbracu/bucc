"use client";
import Image from "next/image";
import botIcon from "/public/images/ai/bot.png";
import { Card } from "@/components/ui/card";
import ChatBotHeader from "./ChatBotHeader";
import ChatBotControls from "./ChatBotControls";
import ChatBotStatus from "./ChatBotStatus";

export default function ChatBot() {
  return (
    <Card className="col-span-2 flex h-auto flex-col justify-between bg-blue-100">
      <ChatBotHeader />

      <div className="flex flex-1">
        <div className="flex w-1/2 items-center justify-center">
          <Image
            src={botIcon}
            alt="ChatBot"
            width={150}
            height={150}
            className="object-fit"
          />
        </div>

        <ChatBotControls />
      </div>

      <ChatBotStatus />
    </Card>
  );
}
