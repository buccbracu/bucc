import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function FilterComponent({
  filters,
  onFilterChange,
  onResetFilters,
}: {
  filters: any;
  onFilterChange: any;
  onResetFilters: () => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value });
  };

  const handleStatusChange = (value: any) => {
    setStatus(value);
    onFilterChange({ status: value });
  };

  const handleDepartmentChange = (value: any) => {
    setDepartment(value);
    onFilterChange({ department: value });
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setDepartment("");
    onResetFilters();
  };

  return (
    <div className="flex items-center justify-between mb-6 w-full">
      <div className="flex items-center space-x-4 w-full">
        {filters.map((filter: any) => (
          <div className="relative w-1/4" key={filter.name}>
            {filter.type === "search" && (
              <div className="relative">
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                  value={search}
                  onChange={handleSearchChange}
                />
                <SearchIcon className="absolute top-1/2 left-2 transform -translate-y-1/2" />
              </div>
            )}
            {filter.type === "select" && (
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filter.name === "status" ? status : department}
                onChange={(e) =>
                  filter.name === "status"
                    ? handleStatusChange(e.target.value)
                    : handleDepartmentChange(e.target.value)
                }
              >
                <option value="">{filter.placeholder}</option>
                {filter.options.map((option: any) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        <Button onClick={handleResetFilters}>Reset Filters</Button>
      </div>
    </div>
  );
}
