"use client";
import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordField from "@/components/ui/password-field";
import { MailIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const session = useSession();
  if (session.status === "authenticated") {
    router.push("/dashboard");
  }
  const [isPending, startTransition] = useTransition();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      login(formData).then((data) => {
        try {
          if (data?.error) {
            toast.error(data.error);
            return;
          }
          toast.success("Login successful!");
        } catch (error) {
          toast.error("An error occurred");
        }
      });
    });
  };
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your g-suite email and password to sign in.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              className="rounded-m pl-10 shadow-sm sm:text-sm"
              name="email"
              placeholder="Email address"
              type="email"
            />
            <MailIcon className="absolute left-3 top-1/2 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          <PasswordField />
          <div className="flex items-center justify-between">
            <Link
              className="text-sm font-medium text-gray-900 underline transition-colors hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-200"
              href="#"
            >
              Forgot your password?
            </Link>
            <Link
              className="f text-sm font-medium text-gray-900 underline transition-colors hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-200"
              href="#"
            >
              Not a member? Register
            </Link>
          </div>
          <Button
            disabled={isPending}
            className="w-full rounded-md bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900"
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
