"use client";

import { EyeIcon, LockIcon } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "./button";
import { Input } from "./input";
import { Tooltip, TooltipTrigger } from "./tooltip";

interface PasswordFieldProps {
  name: "password" | "currentPassword" | "newPassword" | "confirmPassword";
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  placeholder?: string;
  isVisible: boolean;
  toggleVisibility: () => void;
  onPasswordChange?: (password: string) => void;
}

export default function PasswordField({
  name,
  register,
  errors,
  placeholder = "Password",
  isVisible,
  toggleVisibility,
  onPasswordChange, // Add the callback
}: PasswordFieldProps) {
  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Input
              className={`rounded-md pl-10 shadow-sm sm:text-sm ${
                errors[name] ? "border-red-600" : ""
              }`}
              placeholder={placeholder}
              type={isVisible ? "text" : "password"}
              {...register(name, {
                required: `${name === "newPassword" ? "New" : "Confirm"} password is required`,
                onChange: (e) => {
                  onPasswordChange?.(e.target.value); // Trigger password strength check
                },
              })}
            />
            <LockIcon className="absolute left-3 top-1/2 w-4 -translate-y-1/2 text-gray-400" />
            <Button
              type="button"
              className="absolute bottom-1.5 right-1 h-7 w-7"
              size="icon"
              variant="ghost"
              onClick={toggleVisibility}
            >
              <EyeIcon className="h-4 w-4" />
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
        </TooltipTrigger>
        {errors[name]?.message && (
          <p className="text-sm text-red-600">
            {String(errors[name]?.message)}
          </p>
        )}
      </Tooltip>
    </div>
  );
}
