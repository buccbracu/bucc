// src/components/ui/InfoDialog.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

// Define props type for the InfoDialog component
interface InfoDialogProps {
  title: string;
  trigger: React.ReactNode; // The button or trigger element
}

export default function InfoDialog({ title, trigger }: InfoDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
          <Dialog.Title className="text-2xl text-black font-bold">{title}</Dialog.Title>

          {/* Hardcoded Info Content */}
          <Dialog.Description className="mt-2 text-sm text-gray-700">
            <p>
              The chatbot is using <strong> GPT-4o-mini</strong> for processing
              requests and
              <strong> text-ada-002</strong> for embeddings. It is designed to
              provide an interactive and intelligent chat experience. You can
              interact with the bot, and it will respond based on the trained
              data.
            </p>
            <p className="mt-4">
              The system is built on a <strong> PostgreSQL</strong> database
              hosted as a Docker container on <strong>DigitalOcean</strong>,
              providing reliable and scalable storage for the application.
            </p>
            <p className="mt-4">
              For configuration settings, we are utilizing{" "}
              <strong> Redis</strong> as our key-value store, ensuring fast and
              efficient retrieval of configuration values.
            </p>
            <p className="mt-4">
              <strong>Be cautious when configuring the chatbot</strong> as
              improper configurations might destroy its core features, which
              could affect its functionality. When inserting data, make sure
              only to add specific information relevant to the chatbot&apos;s
              operation. <strong> No casual or formal lines are needed.</strong>
            </p>
            <p className="mt-4">
              <strong>Note:</strong> We might run out of tokens, so it&apos;s
              important to manage input carefully to avoid disruption in
              service.
            </p>
          </Dialog.Description>

          <div className="mt-4 flex justify-end">
            <Dialog.Close asChild>
              <Button variant="secondary">Close</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
