"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SpinnerComponent from "@/components/SpinnerComponent";

type IntakeData = {
  _id: string;
  intakeName: string;
  intakeStartDate: string;
  intakeEndDate: string;
  isIntakeActive: boolean;
  isEvaluationActive: boolean;
};

export default function IntakeStatusToggle() {
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchIntake = async () => {
    try {
      const response = await fetch("/api/intake");
      if (response.ok) {
        const data = await response.json();
        setIntake(data);
      } else {
        toast.error("No active intake found");
      }
    } catch (error) {
      console.error("Error fetching intake:", error);
      toast.error("Failed to fetch intake status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntake();
  }, []);

  const handleToggle = async (field: "isIntakeActive" | "isEvaluationActive") => {
    if (!intake) return;

    setUpdating(true);
    try {
      const newValue = !intake[field];
      const response = await fetch("/api/intake/toggle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intakeId: intake._id,
          [field]: newValue,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update intake status");
      }

      setIntake(result.intake);
      toast.success(
        `${field === "isIntakeActive" ? "Registration" : "Evaluation"} ${newValue ? "activated" : "deactivated"}`,
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update intake status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intake Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <SpinnerComponent />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!intake) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intake Status</CardTitle>
          <CardDescription>No active intake found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intake Status</CardTitle>
        <CardDescription>{intake.intakeName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1">
            <Label className="text-base font-semibold">
              Registration
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow students to pre-register
            </p>
          </div>
          <Switch
            checked={intake.isIntakeActive}
            onCheckedChange={() => handleToggle("isIntakeActive")}
            disabled={updating}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1">
            <Label className="text-base font-semibold">
              Evaluation
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow students to submit evaluations
            </p>
          </div>
          <Switch
            checked={intake.isEvaluationActive}
            onCheckedChange={() => handleToggle("isEvaluationActive")}
            disabled={updating}
          />
        </div>

        <div className="pt-2 text-xs text-muted-foreground">
          <p>Start: {new Date(intake.intakeStartDate).toLocaleDateString()}</p>
          <p>End: {new Date(intake.intakeEndDate).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
