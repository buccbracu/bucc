"use client";
import Editor from "@/components/editor-c/editor/advanced-editor";
import { JSONContent } from "novel";
import { useState } from "react";
import { defaultValue } from "./default-value";

export default function Home() {
  const [value, setValue] = useState<JSONContent>(defaultValue || null);
  const handleClick = async () => {
    const data = {
      title: "Manually Added Title",
      description: "This description was added manually.",
      content: value.content,
      category: "Programming",
      tags: ["Manual", "Example", "Post"],
      author: "Manual Author",
    };
    try {
      const res = await fetch("http://localhost:3000/api/bucc/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      alert();
    }
    console.log(value);
  };
  return (
    <main className="w-100 flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex w-full max-w-screen-lg flex-col gap-6 rounded-md border bg-card p-6">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Novel Editor Testing Site</h1>
        </div>
        <Editor editable={true} initialValue={value} onChange={setValue} />
      </div>
      <button
        onClick={handleClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Send POST Request
      </button>
    </main>
  );
}
