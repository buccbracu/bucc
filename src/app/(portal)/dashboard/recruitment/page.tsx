"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Badge } from "@/components/ui/badge";
import departments from "@/constants/departments";
import getEvaluations from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EvaluationStats from "./EvaluationStats";
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
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    department: "",
  });
  const [filteredData, setFilteredData] = useState([]);

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
  return (
    <div className="">
      <Heading headingText="Evaluations" subHeadingText="All evaluations" />
      <div className="flex flex-col md:flex-row">
        <div className="order-1 mt-4 w-full md:order-2 md:ml-4 md:mt-0 md:w-1/4">
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
