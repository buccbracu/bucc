"use client";

import EvaluationComponent from "@/components/evaluation/EvaluationComponent";
import IntakeInactive from "@/components/intake-inactive";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { intakeInfo } from "@/constants/buccInfo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EvaluationForm() {
  const router = useRouter();
  const [studentID, setStudentID] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkPreregistered = async (studentID: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/evaluation?studentID=${studentID}`,
      );

      if (response.status === 200) {
        const data = await response.json();
        if (
          data.message === "Preregistration completed, proceed to evaluation"
        ) {
          setIsRegistered(true);
          setShowForm(true);
        }
        setLoading(false);
      } else if (response.status === 400) {
        toast.error("Evaluation already submitted.");
        setLoading(false);
      } else if (response.status === 404) {
        setIsRegistered(false);
        setShowForm(true); // Ensure form is shown even if not preregistered
        toast.error("You are not preregistered.");
        setLoading(false);
      } else {
        toast.error("Failed to check registration status.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to check student ID:", error);
      toast.error("Failed to check registration status.");
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (studentID) {
      setLoading(true);
      checkPreregistered(studentID); // Changed order to only push when status is known
    } else {
      toast.error("Please enter your student ID.");
    }
  };

  if (!intakeInfo.isEvaluationActive) {
    return <IntakeInactive />;
  }

  return (
    <div>
      <h1 className="mt-6 text-center text-xl font-bold tracking-tight md:text-3xl">
        BUCC Written Evaluation Form - {intakeInfo.intakeName}
      </h1>

      {showForm ? (
        isRegistered ? (
          <div className="flex min-h-[calc(100vh-140px)] w-full flex-col items-center justify-center px-4">
            <EvaluationComponent />
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center">
            <h1 className="mb-6 text-center text-2xl font-semibold">
              You have not completed the pre-registration process.
            </h1>
            <p className="mb-4 text-center text-lg">
              Please complete the pre-registration process before proceeding.
            </p>
            {/* Wrap Link around Button */}
            <Link href="/registration">
              <Button> Go to pre-registration</Button>
            </Link>
          </div>
        )
      ) : (
        <div className="mt-12 flex flex-col items-center">
          <h1 className="mb-6 text-center text-2xl font-semibold">
            Please enter your student ID to proceed.
          </h1>
          <Label htmlFor="studentID" className="mb-2 text-lg font-bold">
            Student ID
          </Label>
          <Input
            type="text"
            value={studentID}
            placeholder="Enter your student ID"
            onChange={(e) => setStudentID(e.target.value)}
            className="mb-4 w-72 rounded border border-gray-300 p-2 text-lg"
          />
          <LoadingButton
            type="submit"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
          >
            Proceed to Evaluation
          </LoadingButton>
        </div>
      )}
    </div>
  );
}
