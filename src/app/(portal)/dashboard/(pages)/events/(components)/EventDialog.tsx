"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  CalendarIcon,
  MapPinIcon,
  TagIcon,
  FileTextIcon,
  UsersIcon,
  InfoIcon,
} from "lucide-react";

interface ViewEventDialogProps {
  event: any;
  triggerButton?: React.ReactNode;
}

// Date formatting helper
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function EventDialog({
  event,
  triggerButton,
}: ViewEventDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="secondary" size="sm">
            View
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-lg bg-gray-800 text-white shadow-lg">
        <DialogHeader className="rounded-t-lg bg-gray-900 p-4 text-white">
          <DialogTitle className="text-2xl font-bold">
            Event Details
          </DialogTitle>
          <DialogDescription className="text-sm">
            All event information at a glance
          </DialogDescription>
        </DialogHeader>

        {event && (
          <div className="mt-4 space-y-6 px-4 text-sm">
            {/* Featured Image */}
            {event.featuredImage && (
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={event.featuredImage}
                  alt="Event Image"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            )}

            {/* Event Title */}
            <div className="flex items-center space-x-2">
              <InfoIcon size={18} className="text-blue-400" />
              <p className="text-lg font-semibold">{event.title}</p>
            </div>

            {/* Venue */}
            <div className="flex items-center space-x-2">
              <MapPinIcon size={18} className="text-green-400" />
              <p>{event.venue}</p>
            </div>

            {/* Event Type */}
            <div className="flex items-center space-x-2">
              <TagIcon size={18} className="text-yellow-400" />
              <p>{event.type}</p>
            </div>

            {/* Description */}
            <div className="flex items-center space-x-2">
              <FileTextIcon size={18} className="text-gray-400" />
              <p>{event.description}</p>
            </div>

            {/* Starting Date */}
            <div className="flex items-center space-x-2">
              <CalendarIcon size={18} className="text-purple-400" />
              <p>
                <strong>Starting Date:</strong>{" "}
                {formatDateTime(event.startingDate)}
              </p>
            </div>

            {/* Ending Date */}
            <div className="flex items-center space-x-2">
              <CalendarIcon size={18} className="text-red-400" />
              <p>
                <strong>Ending Date:</strong> {formatDateTime(event.endingDate)}
              </p>
            </div>

            {/* Need Attendance */}
            <div className="flex items-center space-x-2">
              <UsersIcon size={18} className="text-teal-400" />
              <p>
                <strong>Need Attendance:</strong>{" "}
                {event.needAttendance ? "Yes" : "No"}
              </p>
            </div>

            {/* Allowed Members */}
            <div className="flex items-center space-x-2">
              <UsersIcon size={18} className="text-orange-400" />
              <p>
                <strong>Allowed Members:</strong> {event.allowedMembers}
              </p>
            </div>

            {/* Notes */}
            <div className="flex items-center space-x-2">
              <FileTextIcon size={18} className="text-gray-500" />
              <p>
                <strong>Notes:</strong> {event.notes || "N/A"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
