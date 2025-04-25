"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormDialog from "@/components/FormDialog";
import { insertToChatbot } from "@/client/insertToChatBot";
import { toast } from "sonner";

export default function FormDialogButton() {
  const [inputText, setInputText] = useState("");

  const handleInsert = async () => {
    const response = await insertToChatbot(inputText);
    if (response) {
      setInputText("");
      toast.success("Data inserted successfully!");
    } else {
      
      toast.error("Failed to insert data");
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
    </>
  );
}
