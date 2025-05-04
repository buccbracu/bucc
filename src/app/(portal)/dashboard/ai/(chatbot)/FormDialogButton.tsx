"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormDialog from "@/components/FormDialog";
import { insertToChatbot } from "@/client/insertToChatBot";
import { toast } from "sonner";

export default function FormDialogButton() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);


  const handleInsert = async () => {
    setLoading(true);
    try {
      const response = await insertToChatbot(inputText);
      if (response) {
        setInputText("");
        toast.success("Data inserted successfully!");
      } else {
        toast.error("Failed to insert data");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormDialog
        title="Insert Data to Chatbot"
        onInsert={handleInsert}
        loading={loading}
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
          className="w-full resize-none overflow-hidden rounded-md border border-gray-700 bg-black px-4 py-3 text-sm text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring"
        />
      </FormDialog>
    </>
  );
}
