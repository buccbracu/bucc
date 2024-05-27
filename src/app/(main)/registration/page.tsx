"use client";

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
import { ChangeEvent, FormEvent, useState } from "react";

export default function Component() {
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    semester: "",
    year: "",
    department: "",
    gsuite_email: "",
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
      student_id: formData.student_id,
      name: formData.name,
      joined_bracu: `${formData.semester} ${formData.year}`,
      department_bracu: formData.department,
      gsuite_email: formData.gsuite_email,
    };

    try {
      const response = await fetch("/api/users/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration Successful");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Registration
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Fill out the form to create your account.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student_id">Student ID</Label>
            <Input
              id="student_id"
              placeholder="Enter your student ID"
              type="text"
              value={formData.student_id}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gsuite_email">G-Suite Email Address</Label>
            <Input
              id="gsuite_email"
              placeholder="Enter your G-Suite email"
              type="email"
              value={formData.gsuite_email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => handleSelectChange(value, "semester")}
              >
                <SelectTrigger id="semester-name">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="year"
                placeholder="Year"
                type="number"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">BRACU Department</Label>
            <Input
              id="department"
              placeholder="Enter your department"
              type="text"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          <Button className="w-full" type="submit">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
