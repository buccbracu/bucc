"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import { Avatar } from "../ui/avatar";

export default function DigitalIdCard() {
  const session = useSession();

  const { name, email, image, designation, buccDepartment } =
    session.data?.user || {};

  const usernameFallback = name ? name[0].toUpperCase() : "U";

  return (
    <div className="mb-6 grid h-full grid-cols-1 gap-6 text-center md:grid-cols-2 lg:grid-cols-3">
      <Card className="flex flex-col items-center bg-indigo-200">
        <Avatar className="mt-4 h-36 w-36 bg-indigo-100 shadow-sm">
          <AvatarImage alt={name} src={image} className="object-cover" />
          <AvatarFallback className="mx-auto content-center items-center text-center text-6xl font-bold text-indigo-900">
            {usernameFallback}
          </AvatarFallback>
        </Avatar>

        <CardHeader className="py-2 text-lg font-bold text-indigo-900">
          {name}
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm font-semibold text-indigo-900/70">
            {designation}
          </CardDescription>
          <CardDescription className="text-md font-semibold text-indigo-900/70">
            {buccDepartment}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
