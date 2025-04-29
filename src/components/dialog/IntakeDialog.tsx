// components/dialog/IntakeDialog.tsx

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface IntakeDialogProps {
  open: boolean;
  onClose: () => void;
}

const IntakeDialog = ({ open, onClose }: IntakeDialogProps) => {
  const [formData, setFormData] = useState({
    intakeName: "",
    intakeStartDate: "",
    intakeEndDate: "",
    isIntakeActive: true,
    isEvaluationActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form Data:", formData);
    onClose(); // Close dialog after submission
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      {/* Overlay */}
      <Dialog.Overlay
        className="fixed inset-0 z-50 bg-black opacity-60"
        style={{ zIndex: 999 }} // Ensure high enough z-index to overlay other content
      />

      {/* Dialog Content */}
      <Dialog.Content
        className="z-60 fixed left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-lg p-6"
        style={{
          zIndex: 1000, // Ensure the dialog content sits above everything else
          maxHeight: "80vh", // Prevent overflow
          overflowY: "auto", // Allow scroll if the dialog content overflows
          backgroundColor: "#fff", // Solid white background
        }}
      >
        <Dialog.Title className="mb-4 text-xl font-bold">
          Create Intake
        </Dialog.Title>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Intake Name</label>
            <input
              type="text"
              name="intakeName"
              value={formData.intakeName}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block">Intake Start Date</label>
            <input
              type="date"
              name="intakeStartDate"
              value={formData.intakeStartDate}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block">Intake End Date</label>
            <input
              type="date"
              name="intakeEndDate"
              value={formData.intakeEndDate}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block">Is Intake Active?</label>
            <input
              type="checkbox"
              name="isIntakeActive"
              checked={formData.isIntakeActive}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>

          <div className="mb-4">
            <label className="block">Is Evaluation Active?</label>
            <input
              type="checkbox"
              name="isEvaluationActive"
              checked={formData.isEvaluationActive}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              className="w-full rounded bg-blue-500 py-2 text-white"
            >
              Save
            </Button>
          </div>
        </form>

        <Dialog.Close asChild>
          <Button className="mt-4">Close</Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default IntakeDialog;