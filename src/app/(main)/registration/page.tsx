"use client";

import IntakeInactive from "@/components/intake-inactive";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { buccSocials, intakeInfo } from "@/constants/buccInfo";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

export default function Registration() {
  const registrationActive = intakeInfo.isIntakeActive;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    semester: "",
    year: "",
    departmentBracu: "",
    email: "",
  });

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

    const data = {
      studentId: formData.studentId,
      name: formData.name,
      joinedBracu: `${formData.semester} ${formData.year}`,
      departmentBracu: formData.departmentBracu,
      email: formData.email,
    };

    startTransition(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/registration`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );

        if (response.ok) {
          toast.success("Registration successful!");
          setIsRegistered(true);
        } else {
          toast.error("Registration failed!");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  if (!registrationActive) {
    return <IntakeInactive endDate={intakeInfo.intakeEndDate} />;
  }

  return isRegistered ? (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <Card className="w-full max-w-lg space-y-6 p-8">
        <CardHeader className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-green-500/20 p-6">
            <CircleCheckBig className="h-16 w-16 text-green-500" />
          </div>
        </CardHeader>

        <CardContent className="items-center justify-center text-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Registration Successful!
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You have successfully registered for {intakeInfo.intakeName}.
              Please make sure to fill up the
              <strong className="text-[#127cc1]">
                <Link href={"/evaluation"}> Written Evaluation Form</Link>
              </strong>{" "}
              before attending for interview. Keep an eye on your email and our
              <strong className="text-[#127cc1]">
                {" "}
                <Link href={buccSocials.facebook}>Facebook page</Link>
              </strong>{" "}
              for further updates.
            </p>
          </div>
        </CardContent>
        <div className="flex gap-2">
          <Button
            className="w-full rounded-md bg-[#127cc1] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1f4864] dark:bg-[#127cc1] dark:text-white dark:hover:bg-[#1f4864]"
            onClick={() => router.push("/evaluation")}
          >
            Fill Evaluation Form
          </Button>
          <Button
            className="w-full rounded-md bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              className="rounded-md shadow-sm sm:text-sm"
              required
              id="name"
              placeholder="Enter your name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              className="rounded-md shadow-sm sm:text-sm"
              required
              id="studentId"
              placeholder="Enter your student ID"
              type="text"
              pattern="^[0-9]{8}$"
              title="Please enter a valid student ID."
              value={formData.studentId}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">G-Suite Email Address</Label>
            <Input
              className="rounded-md shadow-sm sm:text-sm"
              required
              id="email"
              placeholder="Enter your G-Suite email"
              type="email"
              pattern="^[a-zA-Z0-9._%+-]+@bracu.ac.bd$"
              title="Please enter a valid G-Suite email address."
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester">Joined BRACU</Label>
            <div className="flex gap-2">
              <Select
                required
                value={formData.semester}
                onValueChange={(value) => handleSelectChange(value, "semester")}
              >
                <SelectTrigger
                  id="semester-name"
                  className="rounded-md shadow-sm sm:text-sm"
                >
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                </SelectContent>
              </Select>
              <Input
                className="rounded-md shadow-sm sm:text-sm"
                required
                id="year"
                placeholder="Year"
                type="number"
                min={2000}
                max={2099}
                step="1"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentBracu">BRACU Department</Label>
            <Input
              className="rounded-md shadow-sm sm:text-sm"
              required
              id="departmentBracu"
              placeholder="Enter Your BRACU Department"
              type="text"
              value={formData.departmentBracu}
              onChange={handleChange}
            />
          </div>
          <LoadingButton
            className="w-full"
            type="submit"
            disabled={isPending}
            loading={isPending}
          >
            Register
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
