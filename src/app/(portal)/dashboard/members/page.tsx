"use client";

import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import designations from "@/constants/designations";
import { getDepartmentMembers } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const columns = [
  { header: "Name", accessorKey: "name" },
  { header: "Designation", accessorKey: "designation" },
  { header: "Joined BRACU", accessorKey: "joinedBracu" },
  { header: "Joined BUCC", accessorKey: "joinedBucc" },
  { header: "Last Promotion", accessorKey: "lastPromotion" },
];

const filterOptions = [
  {
    type: "search",
    name: "search",
    placeholder: "Search by student ID or name",
  },
  {
    type: "select",
    name: "designation",
    placeholder: "Filter by designation",
    options: designations.slice(6).map((designation) => designation.title),
  },
];

export default function Members() {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    designation: "",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["members"],
    queryFn: getDepartmentMembers,
  });

  useEffect(() => {
    if (data && data.users) {
      const updatedData = data.users.map((item: any) => ({
        ...item,
      }));

      const filtered = updatedData.filter((item: any) => {
        const studentId = item.studentId.toString().toLowerCase();
        const search = filters.search.toLowerCase();

        return (
          (!filters.search ||
            item.name.toLowerCase().includes(search) ||
            studentId.includes(search)) &&
          (!filters.designation ||
            item.designation.toLowerCase() ===
              filters.designation.toLowerCase())
        );
      });

      setFilteredData(filtered);
    }
  }, [data, filters]);

  const handleFilterChange = (filter: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filter }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", designation: "" });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching members</div>;
  }

  return (
    <div>
      <Heading
        headingText="Members"
        subHeadingText="All members of your department"
      />
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
            : data.users
        }
        columns={columns}
      />
    </div>
  );
}
