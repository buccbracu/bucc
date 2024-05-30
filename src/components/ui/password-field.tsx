"use client";

import { EyeIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

export default function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        className="pl-10 shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm border-gray-300 rounded-md"
        name="password"
        placeholder="Password"
        type={showPassword ? "text" : "password"}
      />
      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4" />
      <Button
        type="button"
        className="absolute bottom-1.5 right-1 h-7 w-7"
        size="icon"
        variant="ghost"
        onClick={() => setShowPassword(!showPassword)}
      >
        <EyeIcon className="h-4 w-4" />
        <span className="sr-only">Toggle password visibility</span>
      </Button>
    </div>
  );
}
