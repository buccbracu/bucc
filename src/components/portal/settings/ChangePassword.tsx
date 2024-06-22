"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PasswordField from "@/components/ui/password-field";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ChangePassword() {
  const [isStrongPassword, setIsStrongPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);

  useEffect(() => {
    if (newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        setPasswordMatch(true);
      } else {
        setPasswordMatch(false);
      }
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/changePassword`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog>
      <Card className="flex h-full flex-col justify-between sm:w-full">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Change your password.</CardDescription>
        </CardHeader>
        <CardFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Change Password</Button>
          </DialogTrigger>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <PasswordField
              placeholder="Current password"
              password={currentPassword}
              setPassword={setCurrentPassword}
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="new-password">
              New Password
            </Label>
            <PasswordField
              isRegistering={true}
              onPasswordStrengthChange={setIsStrongPassword}
              placeholder="New password"
              password={newPassword}
              setPassword={setNewPassword}
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="confirm-password">
              Confirm Password
            </Label>
            <PasswordField
              placeholder="Confirm password"
              password={confirmPassword}
              setPassword={setConfirmPassword}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!isStrongPassword || !passwordMatch}
            type="button"
            onClick={handleSubmit}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
