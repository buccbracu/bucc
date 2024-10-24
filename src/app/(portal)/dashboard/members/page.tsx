"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import departments from "@/constants/departments";
import designations from "@/constants/designations";
import generateSemesters from "@/helpers/generateSemesters";
import { getDepartmentMembers } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  { header: "Designation", accessorKey: "designation" },
  { header: "Joined BRACU", accessorKey: "joinedBracu" },
  { header: "Joined BUCC", accessorKey: "joinedBucc" },
  { header: "Last Promotion", accessorKey: "lastPromotion" },
  {
    header: "Facebook",
    accessorKey: "memberSocials.Facebook",
    cell: ({ getValue }: any) => {
      const value = getValue();
      const facebookUrl =
        value && !value.startsWith("http") ? `https://${value}` : value;

      return facebookUrl ? (
        <Link
          href={facebookUrl}
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          View Profile
        </Link>
      ) : (
        "N/A"
      );
    },
  },
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
  {
    type: "select",
    name: "joinedBucc",
    placeholder: "Filter by joining semester",
    options: generateSemesters(),
  },
];

export default function Members() {
  const session = useSession();
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    designation: "",
    joinedBucc: "",
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
              filters.designation.toLowerCase()) &&
          (!filters.joinedBucc || // Add this line
            item.joinedBucc === filters.joinedBucc) // Check if joinedBucc matches
        );
      });

      setFilteredData(filtered);
    }
  }, [data, filters]);

  const handleFilterChange = (filter: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filter }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", designation: "", joinedBucc: "" });
  };

  if (isLoading || session.status === "loading") {
    return <SpinnerComponent />;
  }

  if (isError) {
    return <div>Error fetching members</div>;
  }

  const { designation, buccDepartment }: any = session?.data?.user;

  if (
    !permittedDepartments.includes(buccDepartment) ||
    !permittedDesignations.includes(designation)
  ) {
    return <div>You are not authorized to visit this page!</div>;
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
