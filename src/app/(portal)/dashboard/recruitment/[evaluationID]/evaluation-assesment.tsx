import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import departments from "@/constants/departments";
import { useState } from "react";

export default function EvaluationAssessment({ evaluationData }: any) {
  const [interviewer, setInterviewer] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("pending");
  const [comment, setComment] = useState("");

  const handleInterviewerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterviewer(e.target.value);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // async function submitAssessment() {
  //   try {
  //     const assessmentData = {
  //       ...evaluationData,
  //       interviewer,
  //       assignedDepartment: department,
  //       status,
  //       comment,
  //     };

  //     const response = await fetch("/api/postAssessment", {
  //       method: "PATCH",
  //       body: JSON.stringify(assessmentData),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       alert("Assessment added successfully.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting assessment:", error);
  //   }
  // }
  return (
    <div className="max-w-lg mx-auto p-6 rounded shadow-lg dark:bg-gray-700 dark:text-gray-100 bg-gray-100 text-gray-800">
      <div className="mb-4">
        <Label htmlFor="studentId" className="block font-bold mb-2">
          Student ID
        </Label>
        <Input
          type="text"
          id="studentId"
          value={evaluationData.studentId}
          readOnly
          className="px-3 py-2 w-full rounded border focus:outline-none focus:ring-2"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="studentName" className="block font-bold mb-2">
          Student Name
        </Label>
        <Input
          type="text"
          id="studentName"
          value={evaluationData.name}
          readOnly
          className="px-3 py-2 w-full rounded border focus:outline-none focus:ring-2"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="interviewTakenBy" className="block font-bold mb-2">
          Interview Taken By
        </Label>
        <Input
          type="text"
          id="interviewTakenBy"
          value={interviewer}
          onChange={handleInterviewerChange}
          className="px-3 py-2 w-full rounded border focus:outline-none focus:ring-2"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="assignedDepartment" className="block font-bold mb-2">
          Assigned Department
        </Label>
        <Select onValueChange={handleDepartmentChange}>
          <SelectTrigger className="px-4 py-2 w-full rounded border focus:outline-none focus:ring-2">
            <SelectValue placeholder={evaluationData.buccDepartment} />
          </SelectTrigger>
          <SelectContent>
            {departments.slice(2).map((department) => (
              <SelectItem key={department.title} value={department.title}>
                {department.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="status" className="block font-bold mb-2">
          Status
        </Label>
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="px-4 py-2 w-full rounded border focus:outline-none focus:ring-2">
            <SelectValue placeholder={evaluationData.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="comment" className="block font-bold mb-2">
          Comment
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          className="px-3 py-2 w-full rounded border focus:outline-none focus:ring-2"
        ></Textarea>
      </div>
      <Button className="w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Save
      </Button>
    </div>
  );
}
