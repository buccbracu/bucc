import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

// Define the type for interviewee attendance data
interface StudentData {
  _id: string;
  studentId: string;
  name: string;
  firstChoice: string;
  sent: boolean;
  hold: boolean;
}

export default function RealTimeInterviewee() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/intervieweeAttendance");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setStudents(result);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to map firstChoice to department
  const getDepartmentFromFirstChoice = (firstChoice: string): string => {
    switch (firstChoice.toLowerCase()) {
      case "communication and marketing":
        return "C&M";
      case "human resources":
        return "HR";
      case "event management":
        return "EM";
      case "finance":
        return "Finance";
      case "creative":
        return "Creative";
      case "public relations":
        return "PR";
      case "research and development":
        return "R&D";
      default:
        return "Other"; // For any unrecognized department
    }
  };

  // Initialize department counts
  const departmentCounts: { [key: string]: number } = {
    "C&M": 0,
    HR: 0,
    EM: 0,
    Finance: 0,
    Creative: 0,
    PR: 0,
    "R&D": 0,
    Hold: 0,
    Other: 0, // For any unrecognized department
  };

  // Calculate total number of students in the queue
  let totalInQueue = 0;

  // Populate department counts based on logic
  students.forEach((student) => {
    if (student.hold) {
      // If hold is true, count in Hold only
      departmentCounts["Hold"] += 1;
    } else if (!student.sent) {
      // If hold is false and sent is false, count in the department and add to total queue
      const department = getDepartmentFromFirstChoice(student.firstChoice);
      departmentCounts[department] += 1;
      totalInQueue += 1; // Increment total queue
    }
  });

  return (
    <Card className="min-w-72 rounded-lg bg-blue-200 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200/80 md:max-w-md">
      <CardHeader className="mb-4 text-xl font-bold">
        Realtime Waiting
      </CardHeader>
      <CardContent>
        <CardDescription>
          {Object.keys(departmentCounts).map((department) => (
            <div key={department} className="flex justify-between">
              <span>{department}</span>
              <span>{departmentCounts[department]}</span>
            </div>
          ))}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between font-bold">
          <span>Total in Queue:</span>
          <span>{totalInQueue}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
