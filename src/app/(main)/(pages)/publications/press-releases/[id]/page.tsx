"use client";

import ContentParser from "@/components/editor-c/editor/content-parser";
import SpinnerComponent from "@/components/SpinnerComponent";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; 

interface EventData {
  title: string;
  startingDate: string;
  endingDate: string;
    description: string;
}

interface PressRelease {
  title: string;
  content: any;
  description: string;
  featuredImage: string;
  createdDate: string;
  eventId?: string;
}

export default function PressReleaseDetails() {
    const router = useRouter();
  const { id } = useParams();
  const [pressRelease, setPressRelease] = useState<PressRelease | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPressReleaseAndEvent = async () => {
      try {
        const res = await fetch(`/api/press-releases/${id}`);
        if (!res.ok) throw new Error("Failed to fetch press release");
        const data = await res.json();
        setPressRelease(data);

        // Fetch linked event if eventId exists
        if (data.eventId) {
          const eventRes = await fetch(`/api/events/${data.eventId}`);
          if (!eventRes.ok) throw new Error("Failed to fetch linked event");
          const eventData = await eventRes.json();
          setEvent(eventData);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load press release or event.");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPressReleaseAndEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <SpinnerComponent />
      </div>
    );
  }

  if (isError || !pressRelease) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <p className="text-lg font-medium text-red-500">
          Failed to load press release details.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Header Image */}
      <div className="relative h-[400px] w-full">
        <Image
          src={pressRelease.featuredImage}
          alt={pressRelease.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#202223]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-900 drop-shadow-2xl dark:text-gray-200">
          <h1 className="mb-4 text-4xl font-bold">{pressRelease.title}</h1>

          <p className="mt-3 text-sm">
            Published on:{" "}
            <span className="font-medium">
              {new Date(pressRelease.createdDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="flex justify-center px-4 py-8">
        <div className="flex w-full max-w-6xl items-start gap-8">
          {/* Left Content - Press Release */}
          <div className="flex-1">
            <div className="prose max-w-none dark:prose-invert">
              <ContentParser
                content={pressRelease.content || "No content available"}
              />
            </div>
          </div>

          {/* Right Side - Stackable content */}
          <aside className="w-80 flex-shrink-0 space-y-6">
            {/* Event Section */}
            {event && (
              <div className="rounded-lg border p-4 shadow-md dark:border-gray-700 dark:bg-[#1f1f1f]">
                <h2 className="mb-2 text-xl font-semibold">Event Details</h2>
                <p className="mb-1">
                  <span className="font-medium">Title:</span> {event.title}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Starting Date:</span>{" "}
                  {new Date(event.startingDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Ending Date:</span>{" "}
                  {new Date(event.endingDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Description:</span>
                  {" "}
                  <br />
                  {event.description}
                </p>
              </div>
            )}

            {/* Future Section Placeholder */}
            {/* <div className="rounded-lg border p-4 shadow-md dark:border-gray-700 dark:bg-[#1f1f1f]">
              <h2 className="mb-2 text-xl font-semibold">Title</h2>
              <p>Description</p>
            </div> */}
          </aside>
        </div>
      </section>
    </div>
  );
}
