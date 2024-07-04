"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import PasswordField from "@/components/ui/password-field";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPassword() {
  const token = new URLSearchParams(document.location.search).get("token");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isStrongPassword, setIsStrongPassword] = useState(false);
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

  async function handleResetSubmit() {
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
            token,
            newPassword,
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
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      toast.success("Reset link sent to your email");
      setLoading(false);
    }
  }

  if (token) {
    return (
      <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
        <Card className="w-96">
          <CardHeader className="text-2xl font-semibold">
            Reset Password
          </CardHeader>
          <CardContent className="space-y-2">
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
            <LoadingButton
              type="button"
              disabled={!isStrongPassword || !passwordMatch || loading}
              loading={loading}
              onClick={handleResetSubmit}
            >
              Change Password
            </LoadingButton>
          </CardContent>
          <DialogFooter></DialogFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <Card className="w-96">
        <CardHeader className="text-2xl font-semibold">
          Reset Password
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={handleEmailSubmit}>
            <Label htmlFor="email">G-Suite Email</Label>
            <Input
              type="email"
              pattern=".+@g.bracu.ac.bd"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <LoadingButton type="submit" loading={loading} className="mt-4">
              Send Reset Link
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
