"use client";

import ContentParser from "@/components/editor-c/editor/content-parser";
import SpinnerComponent from "@/components/SpinnerComponent";
import { getBlog } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BlogDetails() {
  const { id } = useParams();

  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlog(id as string),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <SpinnerComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <p className="text-lg font-medium text-red-500">
          Error:{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Feature Image Background */}
      <div className="relative h-[400px] w-full">
        <Image
          src={blog.featuredImage}
          alt={blog.title || "Blog Image"}
          fill
          className="object-cover"
        />
        {/* Conditional Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#202223]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-900 drop-shadow-2xl dark:text-gray-200">
          <h1 className="mb-4 text-4xl font-bold">{blog.title}</h1>
          <p className="text-lg">
            Written by{" "}
            <span className="font-semibold">
              {blog.author?.authorName || "Unknown Author"}
            </span>
          </p>
          {blog.author?.authorDesignation && (
            <p className="text-sm">
              Designation:{" "}
              <span className="font-medium">
                {blog.author.authorDesignation}
              </span>
            </p>
          )}
          {blog.author?.authorDepartment && (
            <p className="text-sm">
              Department:{" "}
              <span className="font-medium">
                {blog.author.authorDepartment}
              </span>
            </p>
          )}
          <p className="mt-3 text-sm">
            Published on:{" "}
            <span className="font-medium">
              {blog.createdDate
                ? new Date(blog.createdDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Date not available"}
            </span>{" "}
            | Category:{" "}
            <span className="font-medium">
              {blog.category || "Uncategorized"}
            </span>
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <section className="container mx-auto max-w-5xl px-4 py-8">
        <div className="prose mx-auto dark:prose-invert">
          {<ContentParser content={blog.content || "Content not available"} />}
        </div>
      </section>
    </div>
  );
}
