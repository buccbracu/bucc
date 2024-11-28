"use client";
import Editor from "@/components/editor-c/editor/advanced-editor";
import { useSearchParams } from "next/navigation";
import { JSONContent } from "novel";
import { useEffect, useState } from "react";
import { defaultValue } from "../create/default-value";

export default function MyBlogs() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const parameter = searchParams.get("id");
  const [value, setValue] = useState<JSONContent>(defaultValue || null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/bucc/blogs?id=${parameter}`,
        );
        if (!response.ok) {
          setError(true);
        }
        const result = await response.json();
        setValue({
          type: "doc",
          content: result.content,
        });
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parameter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: Blog not found</div>;
  }

  return (
    <main className="w-100 flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex w-full max-w-screen-lg flex-col gap-6 rounded-md border bg-card p-6">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Novel Editor Testing Site</h1>
        </div>

        <Editor editable={true} initialValue={value} onChange={setValue} />
      </div>
    </main>
  );
}
