"use client";

import Editor from "@/components/editor-c/editor/advanced-editor";
import Heading from "@/components/portal/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JSONContent } from "novel";
import defaultValue from "../default-value";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector"; // import your MultipleSelector

export default function CreatePR() {
  const [value, setValue] = useState<JSONContent>(defaultValue);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unlinkedEvents, setUnlinkedEvents] = useState<Option[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Option[]>([]);


  const handleSubmit = async () => {
    if (selectedEvent.length === 0) {
      toast.error("Please select an event");
      return;
    }

    const data = {
      title,
      description,
      body: value?.content,
      eventId: selectedEvent[0].value,
    };

    try {
      const res = await fetch("/api/pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to create press release");
      } else {
        toast.success("Press Release created successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create press release. Please try again.");
    }
  };

  return (
    <main>
      <Heading
        headingText="Create Press Release"
        subHeadingText="Write and publish your press release"
      />
      <div className="flex min-h-screen w-full flex-row items-start justify-center gap-6">
        {/* Left Panel */}
        <div className="flex w-2/3 flex-col gap-6">
          <Input
            type="text"
            placeholder="Press Release Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2"
          />
          <Textarea
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border p-2"
          />
          <Editor editable={true} initialValue={value} onChange={setValue} />
        </div>

        {/* Right Panel */}
        <div className="flex w-1/3 flex-col gap-6 rounded-md border p-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Select Event</h3>
            <MultipleSelector
              options={unlinkedEvents}
              value={selectedEvent}
              onChange={(val) => setSelectedEvent(val)}
              maxSelected={1}
              placeholder="Select an event..."
              hidePlaceholderWhenSelected
            />
          </div>
          <Button onClick={handleSubmit}>Publish Press Release</Button>
        </div>
      </div>
    </main>
  );
}
