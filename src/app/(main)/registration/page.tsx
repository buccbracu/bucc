"use client";

import IntakeInactive from "@/components/intake-inactive";
import RegistrationSuccess from "@/components/RegistrationSuccess";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BRACUDepartments from "@/constants/BRACUDepartments";
import { intakeInfo } from "@/constants/buccInfo";
import { registrationSchema } from "@/schemas/registrationSchema";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof registrationSchema>;

export default function Registration() {
  const registrationActive =
    intakeInfo.isIntakeActive &&
    intakeInfo.intakeStartDate <= new Date().toISOString().split("T")[0];

  const [isPending, startTransition] = useTransition();
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    name: "",
    semester: "",
    year: "",
    departmentBracu: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path && error.path[0]) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      toast.error("Please correct the errors in the form");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/registration`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );

        const responseData = await response.json();

        if (response.ok) {
          toast.success(responseData.message || "Registration successful!");
          setIsRegistered(true);
        } else {
          toast.error(responseData.error || "Registration failed!");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  if (!registrationActive) {
    return (
      <IntakeInactive
        startDate={intakeInfo.intakeStartDate}
        endDate={intakeInfo.intakeEndDate}
      />
    );
  }

  return isRegistered ? (
    <RegistrationSuccess />
  ) : (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Registration
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Fill out the form to complete the pre registration for{" "}
            {intakeInfo.intakeName}.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="">
            <Label htmlFor="name">Name</Label>
            <Input
              className="rounded-md shadow-sm sm:text-sm"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
          </div>
          <div className="">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              className="rounded-md shadow-sm sm:text-sm"
              required
              id="studentId"
              placeholder="Enter your student ID"
              title="Please enter a valid student ID."
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
            />
          </div>
          <div className="">
            <Label htmlFor="email">G-Suite Email Address</Label>
            <Input
              className="rounded-md shadow-sm sm:text-sm"
              required
              id="email"
              placeholder="Enter your G-Suite email"
              title="Please enter a valid G-Suite email address."
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="semester">Joined BRACU</Label>
            <div className="flex w-full gap-2">
              <div className="w-1/2">
                <Select
                  required
                  value={formData.semester}
                  onValueChange={(value) =>
                    handleSelectChange(value, "semester")
                  }
                >
                  <SelectTrigger
                    error={errors.semester}
                    className="rounded-md shadow-sm sm:text-sm"
                  >
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/2">
                <Select
                  required
                  value={formData.year}
                  onValueChange={(value) => handleSelectChange(value, "year")}
                >
                  <SelectTrigger
                    error={errors.year}
                    className="rounded-md shadow-sm sm:text-sm"
                  >
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="">
            <Label htmlFor="departmentBracu">Department</Label>
            <Select
              required
              value={formData.departmentBracu}
              onValueChange={(value) =>
                handleSelectChange(value, "departmentBracu")
              }
            >
              <SelectTrigger
                error={errors.departmentBracu}
                className="rounded-md shadow-sm sm:text-sm"
              >
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {BRACUDepartments.map((department) => (
                  <SelectItem
                    key={department.initial}
                    value={department.initial}
                  >
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <LoadingButton className="w-full" type="submit" loading={isPending}>
              Register
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
