"use client";

import Editor from "@/components/editor-c/editor/advanced-editor";
import Heading from "@/components/portal/heading";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { blogCategories, blogTags } from "@/constants/blog-data";
import { useUser } from "@/context/UserContext";
import { uploadImage } from "@/lib/client-cloudinary";
import { extractPublicId } from "@/lib/cloudinary-utils";
import { getBlog } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { JSONContent } from "novel";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import defaultValue from "../../default-value";
import { useRouter } from "next/navigation"; // Add this import


const permittedDepartments = [
  "Governing Body",
  "Press Release and Publications",
  "Research and Development",
];
const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

export default function EditBlog() {
  const { id: blogId } = useParams();
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getBlog(blogId as string),
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

      setStatus(data.status || "draft");
      setCategory(data.category || "");
      setTags(
        data.tags?.map((tag: string) => ({ value: tag, label: tag })) || [],
      );
    }
  }, [data]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(file, "blog");
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
      id: blogId,
      title,
      description,
      featuredImage,
      content: value?.content,
      status,
      category,
      tags: tags.map((tag) => tag.value),
    };

    try {
      const res = await fetch(`/api/blog/${blogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to update blog");
      } else {
        toast.success("Blog updated successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update blog. Please try again.");
    }
  };

  if (isLoading || isUserLoading) return <SpinnerComponent />;

  if (!user) {
    return <p>Error: User data is unavailable</p>;
  }

  if (isError) return <p>Error loading blog data.</p>;

  let availableStatuses = ["draft", "archived"];

  if (
    permittedDepartments.includes(user!.buccDepartment) &&
    permittedDesignations.includes(user!.designation)
  ) {
    availableStatuses = ["draft", "published", "archived"];
  }

  return (
    <main>
      <Heading
        headingText="Edit Blog"
        subHeadingText="Edit your blog post here"
      />
      <div className="flex min-h-screen w-full flex-row items-start justify-center gap-6">
        {/* Left Panel */}
        <div className="flex w-2/3 flex-col gap-6">
          <Input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2"
          />
          <Textarea
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border p-2"
          ></Textarea>

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
                className="absolute right-2 top-2 p-2"
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
            <h2 className="text-lg font-semibold">Category</h2>
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="w-full rounded border p-2">
                <SelectValue placeholder={category} />
              </SelectTrigger>
              <SelectContent>
                {blogCategories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tags</h2>
            <MultipleSelector
              value={tags}
              options={blogTags.map((tag) => ({
                value: tag.slug,
                label: tag.name,
              }))}
              onChange={(options) => setTags(options)}
              placeholder="Add tags..."
              creatable
              maxSelected={10}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Status</h2>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full rounded border p-2">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit}>Update Blog</Button>
        </div>
      </div>
    </main>
  );
}
