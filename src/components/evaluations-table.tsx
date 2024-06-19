"use client";

import getEvaluations from "@/server/actions";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function EvaluationsTable() {
  const router = useRouter();
  const session = useSession();

  const {
    data: evaluations,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["evaluations"],
    queryFn: getEvaluations,
  });

  console.log(evaluations);

  const handleRowClick = (id: string) => {
    router.push(`recruitment/${id}`);
  };

  if (!session.data) {
    return null;
  }

  return (
    <Table>
      <TableHeader className="bg-gray-800 sticky">
        <TableRow className="hover:bg-gray-800">
          <TableHead>Student ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned Department</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && <TableRow>Loading...</TableRow>}
        {isError && <TableRow>Error fetching evaluations</TableRow>}

        {evaluations?.map((evaluation: any) => (
          <TableRow
            key={evaluation._id}
            onClick={() => handleRowClick(evaluation._id)}
            className="cursor-pointer"
          >
            <TableCell>{evaluation.studentId}</TableCell>
            <TableCell>{evaluation.name}</TableCell>
            <TableCell>
              <Badge variant={evaluation.status.toLowerCase()}>
                {evaluation.status}
              </Badge>
            </TableCell>
            <TableCell>{evaluation.buccDepartment}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
