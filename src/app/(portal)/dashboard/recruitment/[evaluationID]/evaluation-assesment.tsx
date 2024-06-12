import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelectInput from "@/components/ui/multi-select-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import departments from "@/constants/departments";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";

const EBsName = ["Sabbir", "Amir", "Niloy"];

export default function EvaluationAssessment({ evaluationData }: any) {
  const { data: session } = useSession();
  const params = useParams();

  const evaluationID = params.evaluationID;

  const [department, setDepartment] = useState(
    evaluationData.buccDepartment || ""
  );
  const [status, setStatus] = useState(evaluationData.status || "");
  const [comment, setComment] = useState(evaluationData.comment || "");
  const [selectedEBs, setSelectedEBs] = useState<string[]>(
    evaluationData.interviewTakenBy || []
  );

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  async function submitAssessment() {
    try {
      const assessmentData = {
        _id: evaluationID,
        interviewTakenBy: selectedEBs,
        modifiedBy: session?.user?.name,
        assignedDepartment: department,
        status,
        comment,
      };

      const response = await fetch("/api/ebassesment", {
        method: "PATCH",
        body: JSON.stringify(assessmentData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Assessment added successfully.");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("An error occurred while submitting the assessment.");
    }
  }

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
          className="px-3 py-2 w-full rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2"
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
          className="px-3 py-2 w-full rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="interviewTakenBy" className="block font-bold mb-2">
          Interview Taken By
        </Label>
        <MultiSelectInput
          data={EBsName}
          selectedItems={selectedEBs}
          setSelectedItems={setSelectedEBs}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="assignedDepartment" className="block font-bold mb-2">
          Assigned Department
        </Label>
        <Select onValueChange={handleDepartmentChange}>
          <SelectTrigger className="px-4 py-2 w-full rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2">
            <SelectValue placeholder={department} />
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
          <SelectTrigger className="px-4 py-2 w-full rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2">
            <SelectValue placeholder={status} />
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
          className="px-3 py-2 w-full rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2"
        ></Textarea>
      </div>
      <Button
        onClick={submitAssessment}
        className="w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Save
      </Button>
    </div>
  );
}
