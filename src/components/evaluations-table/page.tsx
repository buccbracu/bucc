"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

const getEvaluations = async () => {
  const evaluations = await fetch(`/api/evaluations`, {
    cache: "no-store",
    next: { revalidate: 10 },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  return evaluations;
};

export default function EvaluationsTable() {
  const router = useRouter();
  const session = useSession();

  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      const data = await getEvaluations();
      setEvaluations(data);
    };
    fetchEvaluations();
  }, []);

  if (!session.data) return null;

  const handleRowClick = (id: string) => {
    router.push(`recruitment/${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-800 sticky">
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation: any) => (
            <TableRow
              key={evaluation._id}
              onClick={() => handleRowClick(evaluation._id)}
              className="cursor-pointer"
            >
              <TableCell>{evaluation.studentId}</TableCell>
              <TableCell>{evaluation.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    evaluation.status === "Pending"
                      ? "pending"
                      : evaluation.status === "Accepted"
                      ? "accepted"
                      : "rejected"
                  }
                >
                  {evaluation.status}
                </Badge>
              </TableCell>
              <TableCell>{evaluation.assignedDepartment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
