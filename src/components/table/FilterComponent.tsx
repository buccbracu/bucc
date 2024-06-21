import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function FilterComponent({
  filters,
  onFilterChange,
  onResetFilters,
}: {
  filters: {
    name: string;
    type: string;
    placeholder: string;
    options?: string[];
  }[];
  onFilterChange: (filter: any) => void;
  onResetFilters: () => void;
}) {
  const [filterValues, setFilterValues] = useState(() =>
    Object.fromEntries(filters.map((filter) => [filter.name, ""]))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterValues((prevFilters) => ({ ...prevFilters, [name]: value }));
    onFilterChange({ [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilterValues((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    onFilterChange({ [name]: value });
  };

  const handleReset = () => {
    const initialFilterValues = Object.fromEntries(
      filters.map((filter) => [filter.name, ""])
    );
    setFilterValues(initialFilterValues);
    onResetFilters();
  };

  return (
    <div className="flex items-center justify-stretch mb-6 w-full">
      <div className="flex items-center space-x-4 w-full">
        {filters.map((filter) => (
          <div className="relative w-full" key={filter.name}>
            {filter.type === "search" && (
              <div className="relative">
                <Input
                  type="text"
                  name={filter.name}
                  placeholder={filter.placeholder}
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                  value={filterValues[filter.name]}
                  onChange={handleInputChange}
                />
                <SearchIcon className="absolute top-1/2 left-2 transform -translate-y-1/2 px-1" />
              </div>
            )}
            {filter.type === "select" && (
              <Select
                value={filterValues[filter.name]}
                onValueChange={(value) =>
                  handleSelectChange(filter.name, value)
                }
              >
                <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
                  <SelectValue placeholder={filter.placeholder}></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filter.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
        <Button onClick={handleReset}>Reset Filters</Button>
      </div>
    </div>
  );
}
