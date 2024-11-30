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
import { blogCategories } from "@/constants/blog-data";
import { deleteBlog, getBlogs } from "@/server/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const filterOptions = [
  {
    type: "search",
    name: "search",
    placeholder: "Search by title or author",
  },
  {
    type: "select",
    name: "category",
    placeholder: "Filter by category",
    options: blogCategories.map((category) => category.name),
  },
  {
    type: "select",
    name: "status",
    placeholder: "Filter by status",
    options: ["Draft", "Published", "Archived"],
  },
];

export default function MyBlogs() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  });
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success("Blog deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: () => {
      toast.error("Failed to delete blog.");
    },
  });

  const handleDelete = () => {
    if (selectedBlogId) {
      deleteBlogMutation.mutate(selectedBlogId);
      setSelectedBlogId(null);
    }
  };

  const handleEdit = (blogId: string) => {
    window.location.href = `/dashboard/blogs/edit/${blogId}`;
  };

  const filteredData = blogs.filter((blog: any) => {
    const search = filters.search.toLowerCase();
    const status = filters.status.toLowerCase();
    return (
      (!filters.search ||
        blog.title.toLowerCase().includes(search) ||
        blog.author.toLowerCase().includes(search)) &&
      (!filters.category ||
        blog.category.toLowerCase() === filters.category.toLowerCase()) &&
      (!filters.status || blog.status.toLowerCase() === status)
    );
  });

  const handleFilterChange = (filter: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filter }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", category: "", status: "" });
  };

  const columns = [
    { header: "Title", accessorKey: "title" },
    { header: "Author", accessorKey: "author" },
    { header: "Category", accessorKey: "category" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => {
        const statusMap: { [key: string]: string } = {
          draft: "Draft",
          published: "Published",
          archived: "Archived",
        };
        return statusMap[row.original.status] || "Unknown";
      },
    },
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
                onClick={() => setSelectedBlogId(row.original._id)}
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="h-fit">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this blog? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedBlogId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteBlogMutation.status === "pending"}
                >
                  {deleteBlogMutation.status === "pending"
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
  if (isError) return <p>Error loading blogs. Please try again later.</p>;

  return (
    <div>
      <div className="my-6 flex items-center justify-between">
        <Heading
          headingText="Blogs"
          subHeadingText="All blogs created by you"
        />
        <Button
          variant="default"
          size="lg"
          onClick={() => (window.location.href = "/dashboard/blogs/create")}
        >
          Create Blog
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
