"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error } = await authClient.requestPasswordReset({
        email: cleanEmail,
        redirectTo: "/reset-password/confirm",
      });
      if (error) {
        toast.error(error.message || "Failed to send reset link");
      } else {
        toast.success("Password reset link sent to your email!");
        setIsSuccess(true);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 bg-card p-10 rounded-2xl shadow-lg border border-border text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Mail className="h-10 w-10" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Check your email</h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to <span className="text-foreground font-medium">{email}</span>. Please check your inbox and follow the instructions.
            </p>
          </div>
          <div className="pt-4">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-lg border border-border">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <KeyRound className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Forgot Password?</h1>
          <p className="text-muted-foreground text-sm">
            No worries! Enter your email below and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground ml-1" htmlFor="email">Email Address</label>
            <div className="relative">
              <input
                id="email"
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="name@g.bracu.ac.bd"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl font-medium hover:opacity-95 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
          <div className="text-center pt-2">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
