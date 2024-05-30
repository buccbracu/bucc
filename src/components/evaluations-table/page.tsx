"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      const data = await getEvaluations();
      setEvaluations(data);
    };
    fetchEvaluations();
  }, []);

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
          {evaluations.map((user: any) => (
            <TableRow key={user.studentId}>
              <TableCell>{user.studentId}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.status === "Pending"
                      ? "pending"
                      : user.status === "Accepted"
                      ? "accepted"
                      : "rejected"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.assignedDepartment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
