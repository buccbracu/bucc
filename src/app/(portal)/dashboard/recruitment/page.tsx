"use client";

import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Badge } from "@/components/ui/badge";
import departments from "@/constants/departments";
import getEvaluations from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

export default function Evaluations() {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching evaluations</div>;
  }

  return (
    <div className="w-full">
      <Heading headingText="Evaluations" subHeadingText="All evaluations" />
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
  );
}
