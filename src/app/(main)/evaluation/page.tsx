"use client";

import EvaluationComponent from "@/components/evaluation/EvaluationComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { intakeInfo } from "@/constants/buccInfo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EvaluationForm() {
  const router = useRouter();
  const [studentID, setStudentID] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const checkPreregistered = async (studentID: string) => {
    try {
      const response = await fetch(`/api/evaluation?studentID=${studentID}`);
      if (!response.ok) {
        setIsRegistered(false);
      } else {
        setIsRegistered(true);
      }
      setShowForm(true);
    } catch (error) {
      console.error("Failed to check student ID:", error);
    }
  };

  const handleSubmit = () => {
    if (studentID) {
      router.push(`/evaluation?studentID=${studentID}`);
      checkPreregistered(studentID);
    }
  };

  return (
    <div>
      <h1 className="text-xl md:text-3xl font-bold tracking-tight mt-6 text-center">
        BUCC Written Evaluation Form - {intakeInfo.intakeName}
      </h1>

      {showForm ? (
        isRegistered ? (
          <div className="flex flex-col min-h-[calc(100vh-140px)] items-center justify-center px-4 w-full">
            <EvaluationComponent />
          </div>
        ) : (
          <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-semibold text-center mb-6">
              You have not completed the pre-registration process.
            </h1>
            <p className="text-lg text-center mb-4">
              Please complete the pre-registration process before proceeding.
            </p>
            {/* Add link or button for pre-registration */}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center mt-12">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Please enter your student ID to proceed.
          </h1>
          <Label htmlFor="studentID" className="text-lg font-bold mb-2">
            Student ID
          </Label>
          <Input
            type="text"
            value={studentID}
            placeholder="Enter your student ID"
            onChange={(e) => setStudentID(e.target.value)}
            className="p-2 text-lg mb-4 w-72 border border-gray-300 rounded"
          />
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 text-lg text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
