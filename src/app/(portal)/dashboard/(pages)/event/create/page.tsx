"use client";

import { useState } from "react";
import Editor from "@/components/editor-c/editor/advanced-editor";
import Heading from "@/components/portal/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import  departments  from "@/constants/departments";
import  designations  from "@/constants/designations";
import MultipleSelector from "@/components/ui/multiple-selector";
import { uploadImage } from "@/lib/client-cloudinary";
import { extractPublicId } from "@/lib/cloudinary-utils";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { JSONContent } from "novel";
import defaultValue from "../default-value";

export default function CreateEvent() {
  const [value, setValue] = useState<JSONContent>(defaultValue);
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [needAttendance, setNeedAttendance] = useState(false);
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [allowedMembers, setAllowedMembers] = useState("");
  const [allowedDepartments, setAllowedDepartments] = useState<
    { value: string; label: string }[]
  >([]);
  const [allowedDesignations, setAllowedDesignations] = useState<
    { value: string; label: string }[]
  >([]);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(file, "event");
        setFeaturedImage(imageUrl);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image. Please try again.");
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
        toast.error("Failed to delete image. Please try again.");
      }
    }
  };

  const handleSubmit = async () => {
    const data = {
      title,
      venue,
      description,
      featuredImage,
      type,
      needAttendance,
      startingDate,
      endingDate,
      allowedMembers,
      allowedDepartments: allowedDepartments.map((d) => d.value),
      allowedDesignations: allowedDesignations.map((d) => d.value),
      notes,
    };

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to create event");
      } else {
        toast.success("Event created successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <main>
      <Heading
        headingText="Create Event"
        subHeadingText="Plan and publish your event"
      />
      <div className="flex min-h-screen w-full flex-row items-start justify-center gap-6">
        {/* Left Panel */}
        <div className="flex w-2/3 flex-col gap-6">
          <Input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2"
          />
          <Input
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full rounded border p-2"
          />
          <Textarea
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border p-2"
          />
          <Editor editable={true} initialValue={value} onChange={setValue} />
          <Textarea
            placeholder="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Right Panel */}
        <div className="flex w-1/3 flex-col gap-6 rounded-md border p-4">
          <h2 className="text-lg font-semibold">Event Banner</h2>
          {featuredImage ? (
            <div className="relative w-full">
              <Image
                src={featuredImage}
                alt="Event Banner"
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

          <h2 className="text-lg font-semibold">Event Type</h2>
          <Input
            placeholder="Type (e.g. Seminar, Workshop)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          <h2 className="text-lg font-semibold">Attendance Required?</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={needAttendance}
              onChange={(e) => setNeedAttendance(e.target.checked)}
            />
            <label>Need Attendance</label>
          </div>

          <h2 className="text-lg font-semibold">Starting Date & Time</h2>
          <Input
            type="datetime-local"
            value={startingDate}
            onChange={(e) => setStartingDate(e.target.value)}
          />

          <h2 className="text-lg font-semibold">Ending Date & Time</h2>
          <Input
            type="datetime-local"
            value={endingDate}
            onChange={(e) => setEndingDate(e.target.value)}
          />

          <h2 className="text-lg font-semibold">Allowed Members</h2>
          <Select
            value={allowedMembers}
            onValueChange={(value) => setAllowedMembers(value)}
          >
            <SelectTrigger className="w-full rounded border p-2">
              <SelectValue placeholder="Select Member Access" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any</SelectItem>
              <SelectItem value="BUCC Members">BUCC Members</SelectItem>
              <SelectItem value="BRACU Students">BRACU Students</SelectItem>
            </SelectContent>
          </Select>

          {allowedMembers === "BUCC Members" && (
            <>
              <h2 className="text-lg font-semibold">Allowed Departments</h2>
              <MultipleSelector
                options={departments.map((dep) => ({
                                value: dep.title,
                                label: dep.title,
                              }))}
                value={allowedDepartments}
                onChange={(options) => setAllowedDepartments(options)}
                placeholder="Add Departments..."
                creatable
              />

              <h2 className="text-lg font-semibold">Allowed Designations</h2>
              <MultipleSelector
                options={designations.map((des) => ({
                                value: des.title,
                                label: des.title,
                              }))}
                value={allowedDesignations}
                onChange={(options) => setAllowedDesignations(options)}
                placeholder="Add Designations..."
                creatable
              />
            </>
          )}

          <Button onClick={handleSubmit}>Create Event</Button>
        </div>
      </div>
    </main>
  );
}
