"use client";
import { Button } from "@/components/ui/button";

export default function ChatBotControls() {
  return (
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
  );
}
