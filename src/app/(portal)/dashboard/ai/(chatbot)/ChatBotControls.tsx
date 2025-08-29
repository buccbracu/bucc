"use client";
import FormDialogButton from "./FormDialogButton";
import { Button } from "@/components/ui/button";
import InfoDialog from "./InfoDialog";
import SuccessModal from "@/components/success-modal";
import Link from "next/link";

export default function ChatBotControls() {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center gap-2">
      <InfoDialog
        title="Chatbot Details Info"
        trigger={
          <Button variant="secondary" className="w-[120px]">
            Chatbot Info
          </Button>
        }
      />
      <Link href="/dashboard/ai/nimbus+" className="w-[120px] text-center">
        <Button variant="secondary" className="w-[120px]">
          Nimbus+
        </Button>
      </Link>
      <FormDialogButton />
    </div>
  );
}
