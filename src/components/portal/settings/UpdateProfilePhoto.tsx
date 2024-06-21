"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

export default function UpdateProfilePhoto() {
  const session = useSession();
  const data = session.data;
  const profilePhoto = data?.user?.image;
  const name = data?.user?.name;

  return (
    <Card className="sm:w-full h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Update Profile Photo</CardTitle>
        <CardDescription>Update your profile photo.</CardDescription>
      </CardHeader>
      <div className="flex justify-center items-center flex-col">
        <div className="relative w-24 h-24 mb-4">
          {profilePhoto ? (
            <Image
              src={profilePhoto}
              height={100}
              width={100}
              alt={`Profile Image of ${name}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-700">No Image</span>
            </div>
          )}
        </div>
      </div>
      <CardFooter className="flex justify-center">
        <div className="flex space-x-4">
          <CldUploadButton uploadPreset="bucc_members_profile_photo" />
          <CldUploadButton>Remove</CldUploadButton>
        </div>
      </CardFooter>
    </Card>
  );
}
