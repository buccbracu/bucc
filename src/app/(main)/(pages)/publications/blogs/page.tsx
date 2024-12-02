"use client";

import PageHeader from "@/components/page-header";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Badge } from "@/components/ui/badge";
import { getPublicBlogs } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Blogs() {
  const router = useRouter();

  const {
    data: blogs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: getPublicBlogs,
    retry: 2, // Retry twice on failure
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
          Oops! Unable to fetch blogs at the moment. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <PageHeader
        title="Explore Our Blogs"
        description="Dive into insightful blogs about web development, design, and modern frameworks. Learn, explore, and grow with our curated articles written by experts."
      />

      <section className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Blogs Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {blogs.map((blog: any) => (
            <article
              key={blog._id}
              className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
              onClick={() => {
                router.push(`/publications/blogs/${blog._id}`);
              }}
            >
              {/* Blog Image with Gradient */}
              <div className="relative h-60 w-full">
                <Image
                  src={blog.featuredImage || "/fallback-image.jpg"} // Fallback image
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {/* Category Badge */}
                {blog.category && (
                  <Badge className="absolute right-4 top-4 bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md hover:bg-purple-700">
                    {blog.category}
                  </Badge>
                )}
              </div>
              {/* Blog Content */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 via-gray-800/50 to-transparent p-4">
                <h3 className="text-lg font-semibold text-white">
                  {blog.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-300">
                  {blog.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                  <p>By {blog.author.authorName || "Unknown"}</p>
                  <Link
                    href={`/publications/blogs/${blog._id}`}
                    className="text-blue-400 hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
