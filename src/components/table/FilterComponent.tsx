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
    Object.fromEntries(filters.map((filter) => [filter.name, ""])),
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
      filters.map((filter) => [filter.name, ""]),
    );
    setFilterValues(initialFilterValues);
    onResetFilters();
  };

  return (
    <div className="mb-6 flex w-[calc(100vw-160px)] flex-wrap items-center justify-between md:w-full">
      <div className="mb:gap-y-2 flex flex-wrap items-center gap-y-2 space-y-4 md:w-full md:space-x-4 md:space-y-0">
        {filters.map((filter) => (
          <div
            className="md:flex-grow-1 relative w-full flex-grow md:w-auto"
            key={filter.name}
          >
            {filter.type === "search" && (
              <div className="relative">
                <Input
                  type="text"
                  name={filter.name}
                  placeholder={filter.placeholder}
                  className="w-full rounded-md p-2 pl-10"
                  value={filterValues[filter.name]}
                  onChange={handleInputChange}
                />
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 transform px-1" />
              </div>
            )}
            {filter.type === "select" && (
              <Select
                value={filterValues[filter.name]}
                onValueChange={(value) =>
                  handleSelectChange(filter.name, value)
                }
              >
                <SelectTrigger className="w-full rounded-md p-2">
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
        <Button className="w-full md:w-auto" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
