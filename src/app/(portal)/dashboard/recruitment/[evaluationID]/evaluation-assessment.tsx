import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import departments from "@/constants/departments";
import EBs from "@/constants/ebs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const OPTIONS: Option[] = EBs.map((eb) => ({
  label: eb.nickName,
  value: eb.nickName,
}));

export default function EvaluationAssessment({ evaluationData }: any) {
  const { data: session } = useSession();
  const params = useParams();

  const evaluationID = params.evaluationID;
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(
    evaluationData.buccDepartment || "",
  );
  const [status, setStatus] = useState(evaluationData.status || "");
  const [comment, setComment] = useState(evaluationData.comment || "");
  const [selectedEBs, setSelectedEBs] = useState<Option[]>(
    evaluationData.interviewTakenBy.map((eb: string) => ({
      label: eb,
      value: eb,
    })) || [],
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
    setLoading(true);
    try {
      const assessmentData = {
        _id: evaluationID,
        interviewTakenBy: selectedEBs.map((eb) => eb.value),
        modifiedBy: session?.user?.name,
        assignedDepartment: department,
        status,
        comment,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ebassessment`,
        {
          method: "PATCH",
          body: JSON.stringify(assessmentData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        toast.success("Assessment added successfully.");
      } else {
        toast.error("Error submitting assessment:");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the assessment.");
    }
  }

  return (
    <Card className="top-2 md:sticky">
      <CardContent className="py-6">
        <div className="mb-4">
          <Label htmlFor="studentId" className="mb-2 block font-bold">
            Student ID
          </Label>
          <Input
            type="text"
            id="studentId"
            value={evaluationData.studentId}
            readOnly
            className="w-full rounded px-3 py-2 dark:bg-black/10"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="studentName" className="mb-2 block font-bold">
            Student Name
          </Label>
          <Input
            type="text"
            id="studentName"
            value={evaluationData.name}
            readOnly
            className="w-full rounded px-3 py-2 dark:bg-black/10"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="interviewTakenBy" className="mb-2 block font-bold">
            Interview Taken By
          </Label>
          <MultipleSelector
            creatable
            value={selectedEBs}
            onChange={setSelectedEBs}
            defaultOptions={OPTIONS}
            commandProps={{
              className: "w-full rounded dark:bg-black/10",
            }}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                no results found.
              </p>
            }
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="assignedDepartment" className="mb-2 block font-bold">
            Assigned Department
          </Label>
          <Select onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-full rounded px-4 py-2 dark:bg-black/10">
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
          <Label htmlFor="status" className="mb-2 block font-bold">
            Status
          </Label>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full rounded px-4 py-2 dark:bg-black/10">
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
          <Label htmlFor="comment" className="mb-2 block font-bold">
            Comment
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={handleCommentChange}
            className="w-full rounded px-3 py-2 dark:bg-black/10"
          ></Textarea>
        </div>
        <LoadingButton
          onClick={submitAssessment}
          disabled={loading}
          loading={loading}
          className="w-full"
        >
          Submit
        </LoadingButton>
      </CardContent>
    </Card>
  );
}
