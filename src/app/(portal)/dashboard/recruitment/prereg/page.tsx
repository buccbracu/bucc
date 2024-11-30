"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BRACUDepartments from "@/constants/BRACUDepartments";
import { getPreRegMember, getPreRegMembers } from "@/server/actions";
import withAuthorization from "@/util/withAuthorization";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PreRegMember {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  departmentBracu: string;
  joinedBracu: string;
}

const permittedDepartment = "Human Resources";
const permittedDesignations = ["Director", "Assistant Director"];

const columns = [
  { header: "Student ID", accessorKey: "studentId" },
  { header: "Name", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  { header: "Department Bracu", accessorKey: "departmentBracu" },
  { header: "Joined Bracu", accessorKey: "joinedBracu" },
];

const filterOptions = [
  {
    type: "search",
    name: "search",
    placeholder: "Search by student ID or name",
  },
];

function PreRegMembers() {
  const [preregMemberData, setPreregMemberData] = useState<PreRegMember | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [filteredData, setFilteredData] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["preRegMembers"],
    queryFn: getPreRegMembers,
  });

  useEffect(() => {
    if (data && Array.isArray(data.users)) {
      const filtered = data.users.filter((item: any) => {
        const studentId = item.studentId.toString().toLowerCase();
        const search = filters.search.toLowerCase();

        return (
          !filters.search ||
          item.name.toLowerCase().includes(search) ||
          studentId.includes(search)
        );
      });

      setFilteredData(filtered);
    }
  }, [data, filters]);

  const handleFilterChange = (filter: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filter }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "" });
  };

  const handleRowClick = async (row: any) => {
    try {
      const memberId = row.original._id;
      const member = await getPreRegMember(memberId);
      setPreregMemberData(member);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch member details:", error);
      toast.error("Failed to fetch member details");
    }
  };

  const handleSubmit = async () => {
    if (!preregMemberData) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/preregmembers/${preregMemberData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preregMemberData),
        },
      );

      if (response.ok) {
        toast.success("Changes saved successfully!");
        setIsDialogOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update member details.");
      }
    } catch (error) {
      console.error("Error updating member details:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <SpinnerComponent />;
  }

  if (isError) {
    return <div>Error fetching pre-registration members</div>;
  }

  return (
    <div className="">
      <Heading
        headingText="Pre-Registration Members"
        subHeadingText="All pre-registration members"
      />
      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          <FilterComponent
            filters={filterOptions}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
          <TableComponent
            data={
              filteredData.length > 0 ||
              Object.values(filters).some((value) => value)
                ? filteredData
                : data
            }
            columns={columns}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="h-fit max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the details for this pre-registered member.
            </DialogDescription>
          </DialogHeader>
          {preregMemberData && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={preregMemberData.name}
                  onChange={(e) =>
                    setPreregMemberData((prev) =>
                      prev ? { ...prev, name: e.target.value } : null,
                    )
                  }
                />
              </div>

              {/* Student ID */}
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="Enter your student ID"
                  value={preregMemberData.studentId}
                  onChange={(e) =>
                    setPreregMemberData((prev) =>
                      prev ? { ...prev, studentId: e.target.value } : null,
                    )
                  }
                />
              </div>

              {/* G-Suite Email */}
              <div>
                <Label htmlFor="email">G-Suite Email Address</Label>
                <Input
                  id="email"
                  placeholder="Enter your G-Suite email"
                  value={preregMemberData.email}
                  onChange={(e) =>
                    setPreregMemberData((prev) =>
                      prev ? { ...prev, email: e.target.value } : null,
                    )
                  }
                />
              </div>

              {/* Joined BRACU - Semester and Year */}
              <div>
                <Label htmlFor="joinedBracu">Joined BRACU</Label>
                <div className="flex w-full gap-2">
                  {/* Semester */}
                  <div className="w-1/2">
                    <Select
                      value={preregMemberData.joinedBracu.split(" ")[0]} // Assuming format "Semester Year"
                      onValueChange={(value) =>
                        setPreregMemberData((prev) =>
                          prev
                            ? {
                                ...prev,
                                joinedBracu: `${value} ${prev.joinedBracu.split(" ")[1]}`,
                              }
                            : null,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Fall">Fall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div className="w-1/2">
                    <Select
                      value={preregMemberData.joinedBracu.split(" ")[1]} // Assuming format "Semester Year"
                      onValueChange={(value) =>
                        setPreregMemberData((prev) =>
                          prev
                            ? {
                                ...prev,
                                joinedBracu: `${prev.joinedBracu.split(" ")[0]} ${value}`,
                              }
                            : null,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="departmentBracu">Department</Label>
                <Select
                  value={preregMemberData.departmentBracu}
                  onValueChange={(value) =>
                    setPreregMemberData((prev) =>
                      prev ? { ...prev, departmentBracu: value } : null,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRACUDepartments.map((department) => (
                      <SelectItem
                        key={department.name}
                        value={department.initial}
                      >
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dialog Footer */}
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuthorization(PreRegMembers, {
  permittedDepartment,
  permittedDesignations,
});
