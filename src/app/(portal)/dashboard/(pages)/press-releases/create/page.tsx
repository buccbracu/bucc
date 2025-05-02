"use client";

import Editor from "@/components/editor-c/editor/advanced-editor";
import Heading from "@/components/portal/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/client-cloudinary";
import { extractPublicId } from "@/lib/cloudinary-utils";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { JSONContent } from "novel";
import {useState, useEffect } from "react";
import { toast } from "sonner";
import defaultValue from "../default-value";
import { useRouter } from "next/navigation";
import EventSearchDropdown from "../EventSearchDropdown";


export default function CreatePressRelease() {
  const router = useRouter();
  const [value, setValue] = useState<JSONContent>(defaultValue);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
 const [eventId, setEventId] = useState("");
 const [eventDetails, setEventDetails] = useState<null | {
   title: string;
   startingDate: string;
   prId: string | null;
 }>(null);
  const [isUploading, setIsUploading] = useState(false);





  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(file, "press-releases");
        setFeaturedImage(imageUrl);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageDelete = async () => {
    if (featuredImage) {
      const publicId = extractPublicId(featuredImage);
      try {
        const res = await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });

        if (!res.ok) throw new Error("Failed to delete image");

        setFeaturedImage(null);
        toast.success("Image deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete image.");
      }
    }
  };

  const handleSubmit = async () => {
    const data = {
      title,
      description,
      content: value?.content,
      featuredImage,
      eventId,
    };

    try {
      console.log("Submitting data:", JSON.stringify(eventId));
      const res = await fetch("/api/press-releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to create press release.");
      } else {
        toast.success("Press release created successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit. Please try again.");
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
          <h2 className="text-lg font-semibold">Featured Image</h2>
          {featuredImage ? (
            <div className="relative w-full">
              <Image
                src={featuredImage}
                alt="Featured"
                width={400}
                height={300}
                className="w-full rounded-md object-cover"
              />
              <Button
                variant="destructive"
                onClick={handleImageDelete}
                className="absolute right-2 top-2"
              >
                <Trash2Icon size={20} />
              </Button>
            </div>
          ) : (
            <>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-2"
              />
              {isUploading && <p>Uploading...</p>}
            </>
          )}

          <div>
            <h2 className="text-lg font-semibold">Select Event</h2>
            <EventSearchDropdown
              onSelect={(event) => {
                setEventDetails({
                  title: event.title,
                  startingDate: event.startingDate,
                  prId: event.prId,
                });
                setEventId(event._id);
              }}
            />

            {eventDetails && (
              <div className="mt-4 rounded border bg-muted p-4">
                <p>
                  <strong>Title:</strong> {eventDetails.title}
                </p>
                <p>
                  <strong>Starting Date:</strong>{" "}
                  {new Date(eventDetails.startingDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Press Release:</strong>{" "}
                  {eventDetails.prId != null ? (
                    <span className="text-red-600">Already exists</span>
                  ) : (
                    <span className="text-green-600">Available</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <Button onClick={handleSubmit}>Publish Press Release</Button>
        </div>
      </div>
    </main>
  );
}
