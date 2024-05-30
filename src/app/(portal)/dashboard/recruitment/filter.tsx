import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import departments from "@/constants/departments";
import { SearchIcon } from "lucide-react";

const departmnets = departments.slice(2).map((department) => department.title);

export default function Filter() {
  return (
    <div className="flex items-center justify-between mb-6 w-full">
      <div className="flex items-center space-x-4 w-full">
        <div className="relative w-1/2">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <Input
            className="pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search by student ID or name"
            type="search"
          />
        </div>
        <div className="relative w-1/4">
          <Select>
            <SelectTrigger className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Accepted</SelectItem>
              <SelectItem value="failed">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-1/4">
          <Select>
            <SelectTrigger className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              {departmnets.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
