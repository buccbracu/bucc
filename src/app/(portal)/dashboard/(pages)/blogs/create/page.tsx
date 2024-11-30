"use client";

import Editor from "@/components/editor-c/editor/advanced-editor";
import Heading from "@/components/portal/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-selector"; // Multi-Select Component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { blogCategories, blogTags } from "@/constants/blog-data";
import { uploadImage } from "@/lib/client-cloudinary";
import { extractPublicId } from "@/lib/cloudinary-utils";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { JSONContent } from "novel";
import { useState } from "react";
import { toast } from "sonner";
import defaultValue from "../default-value";

export default function CreateBlog() {
  const [value, setValue] = useState<JSONContent>(defaultValue);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [status, setStatus] = useState("draft"); // Default status
  const [category, setCategory] = useState(""); // Selected category
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]); // Array of tag objects
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(file, "blog");
        setFeaturedImage(imageUrl); // Update your state with the uploaded image URL
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false); // End the uploading state
      }
    }
  };

  const handleImageDelete = async () => {
    if (featuredImage) {
      const publicId = extractPublicId(featuredImage); // Extract publicId from URL
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

        setFeaturedImage(null); // Clear the state
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
      description,
      featuredImage,
      content: value?.content,
      status,
      category: category || null, // Include category if provided
      tags: tags.map((tag) => tag.value), // Convert tag objects to string array
    };

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to create blog");
      } else {
        toast.success("Blog created successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create blog. Please try again.");
    }
  };

  return (
    <main>
      <Heading
        headingText="Create Blog"
        subHeadingText="Write and publish your blog post"
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
                className="w-full rounded-md object-cover" // Ensures the image spans the full width and maintains aspect ratio
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
            <h2 className="text-lg font-semibold">Category</h2>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className="w-full rounded border p-2">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {
                  // Render your category options here
                  blogCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tags</h2>
            <MultipleSelector
              options={blogTags.map((tag) => ({
                value: tag.slug,
                label: tag.name,
              }))}
              value={tags}
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit}>Publish Blog</Button>
        </div>
      </div>
    </main>
  );
}
