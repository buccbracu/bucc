"use client";
import Editor from "@/components/editor-c/editor/advanced-editor";
import Heading from "@/components/portal/heading";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/client-cloudinary";
import { extractPublicId } from "@/lib/cloudinary-utils";
import { useParams } from "next/navigation";
import Image from "next/image";
import { JSONContent } from "novel";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPR } from "@/server/actions";
import defaultValue from "../../default-value";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";

export default function EditPressRelease() {
    const { id: prId } = useParams();
    const router = useRouter();
    const { user, isLoading: isUserLoading } = useUser();
  
    const [value, setValue] = useState<JSONContent>(defaultValue);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);
    const [status, setStatus] = useState("draft");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
    const [isUploading, setIsUploading] = useState(false);
  

  // const [eventId, setEventId] = useState("");
  // const [eventDetails, setEventDetails] = useState<null | {
  //   title: string;
  //   startingDate: string;
  //   prId: string | null;
  // }>(null);
  // const [eventCheckLoading, setEventCheckLoading] = useState(false);


 const { data, isLoading, isError } = useQuery({
   queryKey: ["pr", prId],
   queryFn: () => getPR(prId as string),
 });

 useEffect(() => {
   if (data) {
     setTitle(data.title || "");
     setDescription(data.description || "");
     setFeaturedImage(data.featuredImage || null);

     setValue({
       type: "doc",
       content: data.content,
     });

   }
 }, [data]);

// const handleCheckEvent = async () => {
//   if (!eventId) {
//     toast.error("Please enter an Event ID");
//     return;
//   }

//   setEventCheckLoading(true);
//   try {
//     const res = await fetch(`/api/events/${eventId}`);
//     if (!res.ok) throw new Error("Event not found");

//     const data = await res.json();
//     setEventDetails({
//       title: data.title,
//       startingDate: data.startingDate,
//       prId: data.prId,
//     });
//     toast.success("Event found!");
//   } catch (error) {
//     setEventDetails(null);
//     console.error(error);
//     toast.error("Event not found or failed to check.");
//   } finally {
//     setEventCheckLoading(false);
//   }
// };

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
      id: prId,
      title,
      description,
      featuredImage,
      content: value?.content,
      // eventId,
    };

    try {
      // if (eventDetails == null) {
      //   toast.error("Please check the event ID.");
      //   return;
      // }
      // if (eventDetails.prId != null){
      //   toast.error("Event already linked to another press release.");
      //   return;
      // }
      const res = await fetch(`/api/press-releases/${prId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to update press release.");
      } else {
        toast.success("Press release updated successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  if (isLoading) return <SpinnerComponent />;

  return (
    <main>
      <Heading
        headingText="Edit Press Release"
        subHeadingText="Update your press release here"
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
          <Editor
            key={JSON.stringify(value)}
            editable={true}
            initialValue={value}
            onChange={setValue}
          />
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
              />
              {isUploading && <p>Uploading...</p>}
            </>
          )}

          {/* <div>
            <h2 className="text-lg font-semibold">Linked Event ID</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Event Object ID"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full rounded border p-2"
              />
              <Button onClick={handleCheckEvent} disabled={eventCheckLoading}>
                {eventCheckLoading ? "Checking..." : "Check"}
              </Button>
            </div>

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
          </div> */}

          <Button onClick={handleSubmit}>Update Press Release</Button>
        </div>
      </div>
    </main>
  );
}
