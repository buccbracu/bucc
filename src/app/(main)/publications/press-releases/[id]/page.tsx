"use client";

import ContentParser from "@/components/editor-c/editor/content-parser";
import SpinnerComponent from "@/components/SpinnerComponent";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
        {/* Feature Image Background */}
        <div className="relative h-[400px] w-full">
          <Image
            src={pressRelease.featuredImage}
            alt={pressRelease.title || "pressRelease Image"}
            fill
            className="object-cover"
          />
          {/* Conditional Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#202223]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-900 drop-shadow-2xl dark:text-gray-200">
            <h1 className="mb-4 text-4xl font-bold">{pressRelease.title}</h1>
            <p className="text-lg">
              Written by{" "}
              <span className="font-semibold">
                 Press Release & Publication Department (BUCC)
              </span>
            </p>
            
            <p className="mt-3 text-sm">
              Published on:{" "}
              <span className="font-medium">
                {pressRelease.createdDate
                  ? new Date(pressRelease.createdDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Date not available"}
              </span>{" "}
             
            </p>
          </div>
        </div>
  
        {/* pressRelease Content */}
        <section className="container mx-auto max-w-5xl px-4 py-8">
          <div className="prose mx-auto dark:prose-invert">
            {<ContentParser content={pressRelease.content || "Content not available"} />}
          </div>
        </section>
      </div>
    );
}
