"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Editor from "@/components/editor-c/editor/advanced-editor";
import Heading from "@/components/portal/heading";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-selector";
import departments from "@/constants/departments";
import designations from "@/constants/designations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { uploadImage } from "@/lib/client-cloudinary";
import { extractPublicId } from "@/lib/cloudinary-utils";
import { getEvent } from "@/server/actions"; 
import { useQuery } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { JSONContent } from "novel";
import defaultValue from "../../default-value";
import * as XLSX from "xlsx";
import { formatDateForInput } from "@/helpers/formatDateTime";
import { useRouter } from "next/navigation";


export default function EditEvent() {
  const { id: eventId } = useParams();
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();

  const [value, setValue] = useState<JSONContent>(defaultValue);
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

  const [type, setType] = useState(""); 
  const [needAttendance, setNeedAttendance] = useState(false); 
  const [startingDate, setStartingDate] = useState(""); 
  const [endingDate, setEndingDate] = useState(""); 
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState("Hello");
  const [eventUrl, setEventUrl] = useState("");
  const [attendanceFile, setAttendanceFile] = useState<File | null>(null);
  const [allowedMembers, setAllowedMembers] = useState("");
  const [allowedDepartments, setAllowedDepartments] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
    const [studentIDs, setStudentIDs] = useState<string[]>([]);

const [allowedDesignations, setAllowedDesignations] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId as string), 
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setVenue(data.venue || "");
      setDescription(data.description || "");
      setFeaturedImage(data.featuredImage || null);
      setType(data.type || "");
      setNeedAttendance(data.needAttendance || false);
       setStartingDate(formatDateForInput(data.startingDate));
      setEndingDate(formatDateForInput(data.endingDate));
      setAllowedDepartments(
        data.allowedDepartments?.map((dept: string) => ({
          value: dept,
          label: dept,
        })) || [],
      );
      setStudentIDs(data.attendance || []);
      setNotes(data.notes || "");
      setEventUrl(data.eventUrl || "");
      setAllowedDesignations(
    data.allowedDesignations?.map((des: string) => ({
      value: des,
      label: des,
    })) || []);
      setAllowedMembers(data.allowedMembers || "");
    }
  }, [data]);


  const handleAttendanceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setAttendanceFile(file);
        parseAttendanceFile(file);
      }
    };
  
    // Parse the uploaded XLSX file
    const parseAttendanceFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data instanceof ArrayBuffer) {
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  
          const ids = jsonData
            .map((row: any) => row["studentID"])
            .filter((id: any) => id); 
  
          setStudentIDs(ids);
          toast.success(`${ids.length} Student IDs extracted successfully!`);
        }
      };
      reader.readAsArrayBuffer(file);
    };

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId }),
        });

        if (!res.ok) {
          throw new Error("Failed to delete image");
        }

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
      id: eventId,
      title,
      venue,
      description,
      featuredImage,
      eventUrl: eventUrl || null,
      type,
      needAttendance,
      startingDate: startingDate || null,
      endingDate: endingDate || null,
      allowedDepartments: allowedDepartments.map((dept) => dept.value),
      allowedDesignations: allowedDesignations.map(
        (des) => des.value,
      ),
      allowedMembers,
      notes,
      attendance: studentIDs,
    };

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Update failed:", errorData);
        toast.error(`Failed to update event: ${errorData.error || "Unknown error"}`);
      } else {
        toast.success("Event updated successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update event. Please try again.");
    }
  };

  if (isLoading || isUserLoading) return <SpinnerComponent />;

  if (!user) {
    return <p>Error: User data is unavailable</p>;
  }

  if (isError) return <p>Error loading event data.</p>;


  

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
          {/* <Editor editable={true} initialValue={value} onChange={setValue} /> */}
          <Textarea
            placeholder="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded border p-2"
          />
          {needAttendance && (
            <>
              <h2 className="text-lg font-semibold">Upload Attendance File</h2>
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    parseAttendanceFile(file);
                  }
                }}
              />

              {attendanceFile && <p>File selected: {attendanceFile.name}</p>}
              {studentIDs.length > 0 && (
                <div>
                  <h3>Extracted Student IDs:</h3>
                  <ul>
                    {studentIDs.map((id, index) => (
                      <li key={index}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
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

          <h2 className="text-lg font-semibold">Event URL (Optional)</h2>
          <Input
            placeholder="Event registration/details URL (e.g., https://bitbattles.bracucc.org/)"
            value={eventUrl}
            onChange={(e) => setEventUrl(e.target.value)}
            className="w-full rounded border p-2"
          />
          <p className="text-sm text-gray-500">
            This URL will be used when users click the event banner on the homepage
          </p>

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
            onChange={(e) =>
              setStartingDate(e.target.value)
            }
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

          <Button onClick={handleSubmit}>Update Event</Button>
        </div>
      </div>
    </main>
  );
}
