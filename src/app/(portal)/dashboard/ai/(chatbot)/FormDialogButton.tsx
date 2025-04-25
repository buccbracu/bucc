"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormDialog from "@/components/FormDialog";
import { insertToChatbot } from "@/client/insertToChatBot";
import SuccessModal from "@/components/success-modal";

export default function FormDialogButton() {
  const [inputText, setInputText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInsert = async () => {
    const response = await insertToChatbot(inputText);
    if (response) {
      console.log("Inserted successfully:", response);
      setInputText("");
      setShowSuccess(true);
    }
  };

  return (
    <>

     <FormDialog
        title="Insert Data to Chatbot"
        onInsert={handleInsert}
        trigger={
          <Button variant="secondary" className="w-[120px]">
            Insert Data
          </Button>
        }
      >
        <textarea
          rows={12}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your long chatbot training data or prompt here..."
          className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring"
        />
      </FormDialog>
      <SuccessModal
        isOpen={showSuccess}
        messageTitle="Data Inserted!"
        messageBody="Your content has been successfully added to the chatbot."
      />
    </>
  );
}

