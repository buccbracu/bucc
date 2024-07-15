"use client";

import { LoginSchema } from "@/schemas/loginSchema";
import { EyeIcon, LockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "./button";
import { Input } from "./input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface PasswordFieldProps {
  register: UseFormRegister<LoginSchema>;
  errors: FieldErrors<LoginSchema>;
  isRegistering?: boolean;
  onPasswordStrengthChange?: (isStrongPassword: boolean) => void | false;
  placeholder?: string;
  password?: string;
  setPassword?: (password: string) => void;
}

export default function PasswordField({
  register,
  errors,
  isRegistering = false,
  onPasswordStrengthChange,
  placeholder = "Password",
  password,
  setPassword,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isStrongPassword, setIsStrongPassword] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [haveLength, setHaveLength] = useState(false);
  const [haveNumber, setHaveNumber] = useState(false);
  const [haveSpecialCharacter, setHaveSpecialCharacter] = useState(false);
  const [haveCapitalLetter, setHaveCapitalLetter] = useState(false);
  const [haveLowerCaseLetter, setHaveLowerCaseLetter] = useState(false);

  const checkPasswordStrength = (password: string) => {
    const lengthCheck = password.length >= 8;
    const numberCheck = /\d/.test(password);
    const specialCharacterCheck = /[!@#$%^&*]/.test(password);
    const capitalLetterCheck = /[A-Z]/.test(password);
    const lowerCaseLetterCheck = /[a-z]/.test(password);

    setHaveLength(lengthCheck);
    setHaveNumber(numberCheck);
    setHaveSpecialCharacter(specialCharacterCheck);
    setHaveCapitalLetter(capitalLetterCheck);
    setHaveLowerCaseLetter(lowerCaseLetterCheck);

    const strongPassword =
      lengthCheck &&
      numberCheck &&
      specialCharacterCheck &&
      capitalLetterCheck &&
      lowerCaseLetterCheck;

    setIsStrongPassword(strongPassword);
    onPasswordStrengthChange && onPasswordStrengthChange(strongPassword);
  };

  useEffect(() => {
    if (!isRegistering) {
      setHaveLength(true);
      setHaveNumber(true);
      setHaveSpecialCharacter(true);
      setHaveCapitalLetter(true);
      setHaveLowerCaseLetter(true);
      setIsStrongPassword(true);

      onPasswordStrengthChange && onPasswordStrengthChange(true);
    }
  }, [isRegistering, onPasswordStrengthChange]);

  return (
    <div className="">
      <Tooltip open={openTooltip}>
        <TooltipTrigger asChild>
          <div className="relative">
            <Input
              className={`rounded-md pl-10 shadow-sm sm:text-sm ${errors.password ? "border-red-600" : ""}`}
              placeholder={placeholder}
              onFocus={() => setOpenTooltip(true)}
              // onBlur={() => setOpenTooltip(false)}
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                onChange: (e) => {
                  const value = e.target.value;
                  setPassword && setPassword(value);
                  checkPasswordStrength(value);
                },
              })}
              value={password}
            />
            <LockIcon className="absolute left-3 top-1/2 w-4 -translate-y-1/2 text-gray-400" />
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
        </TooltipTrigger>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
        {isRegistering && (
          <TooltipContent
            side="top"
            className="flex w-[25rem] flex-col items-start border-none text-sm text-gray-500 shadow-md md:w-96"
          >
            <div className="relative flex flex-col gap-2 rounded-lg p-2 text-xs">
              {!haveLength && (
                <div className="text-red-500 dark:text-red-300">
                  &#x2717; At least 8 characters
                </div>
              )}
              {haveLength && (
                <div className="text-green-500">
                  &#x2713; At least 8 characters
                </div>
              )}
              {!haveNumber && (
                <div className="text-red-500 dark:text-red-300">
                  &#x2717; At least 1 number
                </div>
              )}
              {haveNumber && (
                <div className="text-green-500">&#x2713; At least 1 number</div>
              )}
              {!haveSpecialCharacter && (
                <div className="text-red-500 dark:text-red-300">
                  &#x2717; At least 1 special character
                </div>
              )}
              {haveSpecialCharacter && (
                <div className="text-green-500">
                  &#x2713; At least 1 special character
                </div>
              )}
              {!haveCapitalLetter && (
                <div className="text-red-500 dark:text-red-300">
                  &#x2717; At least 1 capital letter
                </div>
              )}
              {haveCapitalLetter && (
                <div className="text-green-500">
                  &#x2713; At least 1 capital letter
                </div>
              )}
              {!haveLowerCaseLetter && (
                <div className="text-red-500 dark:text-red-300">
                  &#x2717; At least 1 lowercase letter
                </div>
              )}
              {haveLowerCaseLetter && (
                <div className="text-green-500">
                  &#x2713; At least 1 lowercase letter
                </div>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
}
