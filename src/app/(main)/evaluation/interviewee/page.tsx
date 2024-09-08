"use client";

import RealTimeInterviewee from "@/components/interviewee/RealTimeInterviewee";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import intakeInfo from "@/constants/buccInfo";
import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Extend the TableMeta interface
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Define the AttendanceRecord type
interface AttendanceRecord {
  studentId: string;
  name: string;
  firstChoice: string;
  sent: boolean;
  hold: boolean;
  comment: string;
}

// Custom Cell Component for Inline Editing
const EditableCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<AttendanceRecord, unknown>) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  // Handle switch toggle for boolean fields
  const handleSwitchChange = () => {
    const newValue = !value;
    setValue(newValue);
    table.options.meta?.updateData(index, id, newValue);
  };

  // Sync state with the initial value if it changes externally
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Determine whether to render a switch for boolean values
  const isBoolean = typeof initialValue === "boolean";

  return isBoolean ? (
    <Label className="switch">
      <Input
        type="checkbox"
        checked={value as boolean}
        onChange={handleSwitchChange}
        className="h-4 w-4"
      />
      <span className="slider round"></span>
    </Label>
  ) : (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => table.options.meta?.updateData(index, id, value)}
      className="w-full border-hidden bg-transparent"
    />
  );
};

// Spinner Component
const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4"></div>
  </div>
);

const IntervieweeAttendance = () => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: sessionData } = useSession();
  const userDesignation = sessionData?.user?.designation;
  const userDepartment = sessionData?.user?.buccDepartment;

  // Fetch existing data (on component mount)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/intervieweeAttendance");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "studentId",
      header: "Student ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "firstChoice",
      header: "First Choice",
    },
    {
      accessorKey: "sent",
      header: "Sent?",
      cell: EditableCell,
    },
    {
      accessorKey: "hold",
      header: "Hold?",
      cell: EditableCell,
    },
    {
      accessorKey: "comment",
      header: "Comment",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    defaultColumn: { cell: EditableCell }, // Use custom EditableCell as the default cell
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      // Meta function to update data
      updateData: async (
        rowIndex: number,
        columnId: string,
        value: unknown,
      ) => {
        const updatedRow = { ...data[rowIndex], [columnId]: value };
        setData((oldData) =>
          oldData.map((row, i) => (i === rowIndex ? updatedRow : row)),
        );

        try {
          await fetch("/api/intervieweeAttendance", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRow),
          });
        } catch (error) {
          console.error("Failed to update record:", error);
        }
      },
    },
  });

  // Function to handle new student creation via POST
  const handleCreateStudent = async (studentId: string) => {
    if (!studentId.trim()) {
      console.error("Student ID cannot be empty");
      return;
    }

    try {
      // Fetch the student's details based on studentId
      const studentDataResponse = await fetch(
        `/api/intervieweeAttendance?studentId=${studentId}`,
      );

      if (!studentDataResponse.ok) {
        console.error("Student not found");
        return;
      }

      const studentData = await studentDataResponse.json();

      // Parse the "responseObject" to get the firstChoice (adjust according to your data structure)
      const responseObject = studentData.responseObject
        ? JSON.parse(studentData.responseObject)
        : {};

      // Now create a new student entry using the fetched student data
      const response = await fetch("/api/intervieweeAttendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          name: studentData.name, // Use the name from the fetched student data
          firstChoice: responseObject.question8 || "Unknown", // Fallback to "Unknown" if not available
        }),
      });

      const newRecord = await response.json();
      setData((prev) => [...prev, newRecord.record]);
    } catch (error) {
      console.error("Failed to create new student:", error);
    }
  };

  // Determine row background color based on `sent` and `hold` values
  const getRowClassName = (row: AttendanceRecord) => {
    if (row.hold) {
      return `bg-yellow-200 dark:bg-yellow-700/40 text-yellow-900 dark:text-yellow-200/80`; // Yellow for hold
    }
    if (row.sent) {
      return `bg-green-200 dark:bg-green-900/40 text-green-900 dark:text-green-200/80`; // Green for sent
    }
    return ""; // Default (no color)
  };

  if (loading) {
    return <SpinnerComponent />;
  }

  if (
    !(
      [
        "President",
        "Vice President",
        "General Secretary",
        "Treasurer",
        "Director",
        "Assistant Director",
      ].includes(userDesignation!) ||
      (userDepartment === "Human Resources" &&
        ["Senior Executive"].includes(userDesignation!))
    )
  ) {
    return <h1 className="text-center">You are not allowed!</h1>;
  }

  return (
    <div className="w-[calc(100vw-160px)] overflow-scroll p-6 text-center md:w-full">
      <h2 className="mb-4 text-2xl font-bold">{`Interviewee Attendance Sheet ${intakeInfo.intakeName} for Volunteers`}</h2>
      <div className="flex gap-4">
        <div className="flex flex-grow">
          <div className="w-full">
            <Input
              type="text"
              placeholder="Enter Student ID"
              onBlur={(e) => handleCreateStudent(e.target.value)}
              className="mb-2"
            />

            <Table className="border">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={getRowClassName(row.original)} // Apply conditional row styling
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="p-0" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <RealTimeInterviewee />
      </div>
    </div>
  );
};

export default IntervieweeAttendance;
