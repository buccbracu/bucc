"use client";

import Heading from "@/components/portal/heading";
import SpinnerComponent from "@/components/SpinnerComponent";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import departments from "@/constants/departments";
import designations from "@/constants/designations";
import { getAllMembers } from "@/server/actions";
import withAuthorization from "@/util/withAuthorization";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const columns = [
  { header: "Name", accessorKey: "name" },
  { header: "Student ID", accessorKey: "studentId" },
  { header: "Email", accessorKey: "email" },
  { header: "Designation", accessorKey: "designation" },
  { header: "Department", accessorKey: "buccDepartment" },
];

const filterOptions = [
  {
    type: "search",
    name: "search",
    placeholder: "Search by student ID or name",
  },
  {
    type: "select",
    name: "department",
    placeholder: "Filter by department",
    options: departments.slice(2).map((department) => department.title),
  },
  {
    type: "select",
    name: "designation",
    placeholder: "Filter by designation",
    options: designations.slice(6).map((designation) => designation.title),
  },
];

function Members() {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    designation: "",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allMembers"],
    queryFn: getAllMembers,
  });

  useEffect(() => {
    if (data && data.user) {
      const updatedData = data.user.map((item: any) => ({
        ...item,
        url: `member/${item._id}`,
      }));

      const filtered = updatedData.filter((item: any) => {
        const studentId = item.studentId.toString().toLowerCase();
        const search = filters.search.toLowerCase();

        return (
          (!filters.search ||
            item.name.toLowerCase().includes(search) ||
            studentId.includes(search)) &&
          (!filters.department ||
            item.buccDepartment.toLowerCase() ===
              filters.department.toLowerCase()) &&
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
    setFilters({ search: "", department: "", designation: "" });
  };

  if (isLoading) {
    return <SpinnerComponent />;
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
            : data.user
        }
        columns={columns}
      />
    </div>
  );
}

// Wrap with Authorization HOC
const permittedDepartment = "Human Resources";
const permittedDesignations = ["Director", "Assistant Director"];

export default withAuthorization(Members, {
  permittedDepartment,
  permittedDesignations,
});
