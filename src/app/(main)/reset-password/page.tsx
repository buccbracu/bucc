"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import PasswordField from "@/components/ui/password-field";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/schemas/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

function ResetPassword() {
  const token = useSearchParams().get("token"); // Get token from URL params

  const [loading, setLoading] = useState(false);
  const [isStrongPassword, setIsStrongPassword] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Form configuration for password reset (if token is present)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (newPassword && confirmPassword) {
      setIsStrongPassword(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  // Handle the password reset submission
  async function handleResetSubmit(data: ResetPasswordSchema) {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/resetPassword`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token, // Send the token along with newPassword
            newPassword: data.newPassword,
          }),
        },
      );
      if (response.ok) {
        toast.success("Password changed successfully");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // If token exists in the URL, show the password reset form
  if (token) {
    return (
      <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
        <Card className="w-96">
          <CardHeader className="text-2xl font-semibold">
            Reset Password
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmit(handleResetSubmit)}>
              <div className="mb-4">
                <Label className="mb-4" htmlFor="newPassword">
                  New Password
                </Label>
                <PasswordField
                  name="newPassword"
                  register={register}
                  errors={errors as FieldErrors<ResetPasswordSchema>}
                  placeholder="New password"
                  isVisible={newPasswordVisible}
                  toggleVisibility={() =>
                    setNewPasswordVisible(!newPasswordVisible)
                  }
                />
              </div>
              <div>
                <Label className="mb-4" htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <PasswordField
                  name="confirmPassword"
                  register={register}
                  errors={errors as FieldErrors<ResetPasswordSchema>}
                  placeholder="Confirm password"
                  isVisible={confirmPasswordVisible}
                  toggleVisibility={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                />
              </div>
              <LoadingButton
                className="mt-4"
                type="submit"
                disabled={!isStrongPassword || isSubmitting}
                loading={isSubmitting}
              >
                Change Password
              </LoadingButton>
            </form>
          </CardContent>
          <DialogFooter />
        </Card>
      </main>
    );
  }

  // If no token is found, show the email input form to request a reset link
  return <RequestResetLink loading={loading} setLoading={setLoading} />;
}

// This component handles requesting a reset link by email
function RequestResetLink({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: "onChange",
  });

  // Handle the email submission for requesting a reset link
  async function handleEmailSubmit(data: { email: string }) {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/resetPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.info(result.message || "Reset link sent to your email");
      } else {
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <Card className="w-96">
        <CardHeader className="text-2xl font-semibold">
          Reset Password
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={handleSubmit(handleEmailSubmit)}>
            <Label htmlFor="email">G-Suite Email</Label>
            <Input
              {...register("email", { required: "Email is required" })}
              type="email"
              id="email"
              placeholder="Email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
            <LoadingButton type="submit" loading={loading} className="mt-4">
              Send Reset Link
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<SpinnerComponent />}>
      <ResetPassword />
    </Suspense>
  );
}
