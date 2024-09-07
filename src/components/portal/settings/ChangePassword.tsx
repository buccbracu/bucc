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
import { LoadingButton } from "@/components/ui/loading-button";
import PasswordField from "@/components/ui/password-field";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const [openModal, setOpenModal] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [isStrongPassword, setIsStrongPassword] = useState(false);

  // Set up form handling with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>();

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  // Check password match
  useEffect(() => {
    if (newPassword && confirmPassword) {
      setPasswordMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  // Password strength checker
  const handlePasswordChange = (password: string) => {
    const strongPassword =
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*]/.test(password);
    setIsStrongPassword(strongPassword);
  };

  // Handle form submission
  const handleChangePassword = async (data: ChangePasswordForm) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/changePassword`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Password changed successfully");
        setOpenModal(false);
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <Card className="flex h-full flex-col justify-between sm:w-full">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Change your password here.</CardDescription>
        </CardHeader>
        <CardFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Change Password</Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="h-fit sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Make changes to your password here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleChangePassword)}>
          <div className="grid gap-2">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordField
                name="currentPassword"
                register={register}
                errors={errors}
                placeholder="Current password"
                isVisible={currentPasswordVisible}
                toggleVisibility={() =>
                  setCurrentPasswordVisible(!currentPasswordVisible)
                }
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordField
                name="newPassword"
                register={register}
                errors={errors}
                placeholder="New password"
                isVisible={newPasswordVisible}
                toggleVisibility={() =>
                  setNewPasswordVisible(!newPasswordVisible)
                }
                onPasswordChange={handlePasswordChange} // Check password strength
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordField
                name="confirmPassword"
                register={register}
                errors={errors}
                placeholder="Confirm password"
                isVisible={confirmPasswordVisible}
                toggleVisibility={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <LoadingButton
              className="mt-4"
              type="submit"
              disabled={!passwordMatch || !isStrongPassword || isSubmitting}
              loading={loading}
            >
              Change Password
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
