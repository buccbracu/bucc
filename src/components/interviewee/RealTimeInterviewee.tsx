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

  // Initialize department counts
  const departmentCounts: { [key: string]: number } = {
    "Communication and Marketing": 0,
    Creative: 0,
    "Event Management": 0,
    Finance: 0,
    "Human Resources": 0,
    "Press Release and Publications": 0,
    "Research and Development": 0,
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
      const department = student.firstChoice;
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
