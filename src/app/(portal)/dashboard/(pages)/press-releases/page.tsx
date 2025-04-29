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
import { deletePR, getPRs } from "@/server/actions"; // <-- you need to create these similar to blog ones
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const filterOptions = [
  {
    type: "search",
    name: "search",
    placeholder: "Search by title",
  },
];

export default function PressReleases() {
  const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ search: "" });
    const [selectedPRId, setSelectedPRId] = useState<string | null>(null);
  

  const {
    data: prs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["prs"],
    queryFn: getPRs,
  });

  const deletePRMutation = useMutation({
    mutationFn: deletePR,
    onSuccess: () => {
      toast.success("Press Release deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["prs"] });
    },
    onError: () => {
      toast.error("Failed to delete Press Release.");
    },
  });

  const handleDelete = () => {
    if (selectedPRId) {
      deletePRMutation.mutate(selectedPRId);
      setSelectedPRId(null);
    }
  };

  const handleEdit = (prId: string) => {
    window.location.href = `/dashboard/press-releases/edit/${prId}`;
  };

  const filteredData = prs.filter((pr: any) => {
    const search = filters.search.toLowerCase();
    return (
      !filters.search || pr.title.toLowerCase().includes(search)
    );
  });

  const handleFilterChange = (filter: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filter }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "" });
  };

  const columns = [
    { header: "Title", accessorKey: "title" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row.original._id)}
          >
            Edit
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setSelectedPRId(row.original._id)}
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="h-fit">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this press release? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedPRId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deletePRMutation.status === "pending"}
                >
                  {deletePRMutation.status === "pending"
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ];

  if (isLoading) return <SpinnerComponent />;
  if (isError) return <p>Error loading press releases. Please try again later.</p>;

  return (
    <div>
      <div className="my-6 flex items-center justify-between">
        <Heading
          headingText="Press Releases"
          subHeadingText="All press releases created by you"
        />
        <Button
          variant="default"
          size="lg"
          onClick={() =>
            (window.location.href = "/dashboard/press-releases/create")
          }
        >
          Create PR
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
