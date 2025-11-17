"use client";

import Heading from "@/components/portal/heading";
import SpinnerComponent from "@/components/SpinnerComponent";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { deleteEvent, getEvents } from "@/server/actions";
import EventDialog from "./(components)/EventDialog";


const filterOptions = [
  {
    type: "search",
    name: "search",
    placeholder: "Search by title or venue",
  },
  {
    type: "select",
    name: "type",
    placeholder: "Filter by type",
    options: ["Workshop", "Seminar", "Competition", "Meeting", "Other"], 
  },
];

export default function MyEvents() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    type: "",
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsDeleteDialogOpen(false);
      setSelectedEventId(null);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to delete event.";
      if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
        toast.error("You don't have permission to delete this event. Only Directors or Assistant Directors in Press Release and Publications can delete events.");
      } else {
        toast.error(errorMessage);
      }
      setIsDeleteDialogOpen(false);
    },
  });

  const handleDelete = () => {
    if (selectedEventId) {
      deleteEventMutation.mutate(selectedEventId);
    }
  };

  const handleEdit = (eventId: string) => {
    if (!eventId) {
      toast.error("Event ID is missing. Cannot edit this event.");
      return;
    }
    window.location.href = `/dashboard/events/edit/${eventId}`;
  };

  const filteredData = events.filter((event: any) => {
    const search = filters.search.toLowerCase();
    const type = filters.type.toLowerCase();
    return (
      (!filters.search ||
        event.title.toLowerCase().includes(search) ||
        event.venue.toLowerCase().includes(search)) &&
      (!filters.type || event.type.toLowerCase() === type)
    );
  });

  const handleFilterChange = (filter: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filter }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", type: "" });
  };

  const columns = [
    { header: "Title", accessorKey: "title" },
    { header: "Venue", accessorKey: "venue" },
    { header: "Type", accessorKey: "type" },
    {
      header: "Starting Date",
      accessorKey: "startingDate",
      cell: ({ row }: any) =>
        new Date(row.original.startingDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: any) => {
        const eventId = row.original._id || row.original.id;
        return (
          <div className="flex space-x-2">
            <EventDialog
              event={row.original}
              triggerButton={
                <Button variant="default" size="sm">
                  View
                </Button>
              }
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEdit(eventId)}
              disabled={!eventId}
            >
              Edit
            </Button>
            <Dialog 
              open={isDeleteDialogOpen && selectedEventId === eventId}
              onOpenChange={(open) => {
                setIsDeleteDialogOpen(open);
                if (open) {
                  setSelectedEventId(eventId);
                } else {
                  setSelectedEventId(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={!eventId}
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="h-fit">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this event? This action cannot
                    be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedEventId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteEventMutation.status === "pending"}
                  >
                    {deleteEventMutation.status === "pending"
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <SpinnerComponent />;
  if (isError) return <p>Error loading events. Please try again later.</p>;

  return (
    <div>
      <div className="my-6 flex items-center justify-between">
        <Heading
          headingText="Events"
          subHeadingText="Manage all events you have created"
        />
        <Button
          variant="default"
          size="lg"
          onClick={() => (window.location.href = "/dashboard/events/create")}
        >
          Create Event
        </Button>
      </div>
      <FilterComponent
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      <TableComponent data={filteredData} columns={columns} />
    </div>
  );
}
