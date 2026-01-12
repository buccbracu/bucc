"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import departments from "@/constants/departments";
import getEvaluations from "@/server/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EvaluationStats from "./EvaluationStats";
import IntakeStatusToggle from "@/components/recruitment/IntakeStatusToggle";
import recruitmentIds from "@/constants/studentId";

const permittedDepartments = [
  ...departments.map((department) => department.title),
];
const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

const columns = [
  { header: "Student ID", accessorKey: "studentId" },
  { header: "Name", accessorKey: "name" },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ cell }: { cell: any }) => (
      <Badge variant={cell.getValue().toLowerCase()}>{cell.getValue()}</Badge>
    ),
  },
  { header: "Assigned Department", accessorKey: "buccDepartment" },
  { header: "Comments", accessorKey: "comment" },
];

const filterOptions = [
  {
    type: "search",
    name: "search",
    placeholder: "Search by student ID or name",
  },
  {
    type: "select",
    name: "status",
    placeholder: "Filter by status",
    options: ["Pending", "Accepted", "Rejected"],
  },
  {
    type: "select",
    name: "department",
    placeholder: "Filter by department",
    options: [
      "Not Assigned",
      ...departments.slice(2).map((department) => department.title),
    ],
  },
];

const statusWiseDepartments: any = {
  Accepted: {
    ...Object.fromEntries(
      departments.slice(2).map((department) => [department.title, 0]),
    ),
    "Not Assigned": 0,
  },
  Rejected: {
    ...Object.fromEntries(
      departments.slice(2).map((department) => [department.title, 0]),
    ),
    "Not Assigned": 0,
  },
  Pending: {
    ...Object.fromEntries(
      departments.slice(2).map((department) => [department.title, 0]),
    ),
    "Not Assigned": 0,
  },
};

export default function Evaluations() {
  const session = useSession();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    department: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["evaluations"],
    queryFn: getEvaluations,
  });

  useEffect(() => {
    if (data) {
      data.forEach((item: any) => {
        const department = item.buccDepartment || "Not Assigned";
        const status = item.status;

        if (statusWiseDepartments[status]) {
          statusWiseDepartments[status][department] += 1;
        }
      });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const updatedData = data.map((item: any) => ({
        ...item,
        url: `recruitment/${item._id}`,
      }));

      const filtered = updatedData.filter((item: any) => {
        const studentId = item.studentId.toString().toLowerCase();
        const search = filters.search.toLowerCase();

        return (
          (!filters.search ||
            item.name.toLowerCase().includes(search) ||
            studentId.includes(search)) &&
          (!filters.status || item.status === filters.status) &&
          (!filters.department || item.buccDepartment === filters.department)
        );
      });

      setFilteredData(filtered);
    }
  }, [data, filters]);

  const handleFilterChange = (filter: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filter }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "", department: "" });
  };

  const handleCleanupRecruitment = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/recruitment/cleanup", {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to cleanup recruitment data");
      }

      toast.success("Recruitment data cleaned up successfully", {
        description: `Deleted ${result.deleted.preregMembers} applicants, ${result.deleted.assessments} assessments, ${result.deleted.attendance} attendance records`,
      });

      // Refresh the evaluations data
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    } catch (error: any) {
      toast.error("Failed to cleanup recruitment data", {
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || session.status === "loading") {
    return <SpinnerComponent />;
  }

  if (isError) {
    return <div>Error fetching evaluations</div>;
  }

  const { designation, buccDepartment, studentId }: any = session?.data?.user;
  const permitted = (permittedDepartments.includes(buccDepartment) && permittedDesignations.includes(designation)) || recruitmentIds.includes(studentId);
  // if (
  //   !permittedDepartments.includes(buccDepartment) ||
  //   !permittedDesignations.includes(designation)
  // ) {
  //   return <div>You are not authorized to visit this page!</div>;
  // }

  if (!permitted) {
     return <div>You are not authorized to visit this page!</div>;
  }

  const canCleanup = [
    "President",
    "Vice President",
    "General Secretary",
    "Treasurer",
    "Director",
  ].includes(designation);


  return (
    <div className="">
      <div className="flex items-center justify-between">
        <Heading headingText="Evaluations" subHeadingText="All evaluations" />
        {canCleanup && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? "Cleaning up..." : "Cleanup Recruitment Data"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete:
                  <ul className="mt-2 list-inside list-disc">
                    <li>All pre-registration member information</li>
                    <li>All EB assessments and evaluations</li>
                    <li>All interviewee attendance records</li>
                    <li>Deactivate the current intake</li>
                  </ul>
                  <p className="mt-2 font-semibold text-red-600">
                    Accepted members in MemberInfo will NOT be deleted.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCleanupRecruitment}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, Delete All Recruitment Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="order-1 mt-4 w-full md:order-2 md:ml-4 md:mt-0 md:w-1/4">
          <div className="mb-4">
            <IntakeStatusToggle />
          </div>
          <EvaluationStats evaluationsStats={statusWiseDepartments} />
        </div>
        <div className="order-2 w-full md:order-1 md:w-3/4">
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
          />
        </div>
      </div>
    </div>
  );
}
