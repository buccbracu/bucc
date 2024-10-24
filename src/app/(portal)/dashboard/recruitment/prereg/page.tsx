"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import departments from "@/constants/departments";
import { getPreRegMembers } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

export default function PreRegMembers() {
  const session = useSession();
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

  if (isLoading || session.status === "loading") {
    return <SpinnerComponent />;
  }

  if (isError) {
    return <div>Error fetching pre-registration members</div>;
  }

  const { designation, buccDepartment }: any = session?.data?.user;

  if (
    !permittedDepartments.includes(buccDepartment) ||
    !permittedDesignations.includes(designation)
  ) {
    return <div>You are not authorized to visit this page!</div>;
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
          />
        </div>
      </div>
    </div>
  );
}
