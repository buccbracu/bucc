"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { CldImage, CldUploadButton } from "next-cloudinary";
import { toast } from "sonner";

export default function UpdateProfilePhoto() {
  const session = useSession();
  const data = session.data;
  const profilePhoto = data?.user?.image;
  const name = data?.user?.name;

  const handleProfilePhoto = async (imageUrl: string, action: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/profileImage`,
        {
          method: action === "update" ? "PATCH" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body:
            action === "update"
              ? JSON.stringify({ profileImage: imageUrl })
              : undefined,
        },
      );

      if (response.ok) {
        const message =
          action === "update"
            ? "Profile Image Updated"
            : "Profile Image Removed";
        toast.success(message);
      } else {
        toast.error("Error in Profile Image Operation");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in Profile Image Operation");
    }
  };

  return (
    <Card className="flex h-full flex-col justify-between sm:w-full">
      <CardHeader>
        <CardTitle>Update Profile Photo</CardTitle>
        <CardDescription>Update your profile photo.</CardDescription>
      </CardHeader>
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-4 h-24 w-24">
          {profilePhoto ? (
            <CldImage
              width="960"
              height="600"
              src={profilePhoto}
              sizes="100vw"
              alt={`Profile Image of ${name}`}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
              <span className="text-gray-700">No Image</span>
            </div>
          )}
        </div>
      </div>
      <CardFooter className="flex justify-center">
        <div className="flex space-x-4">
          <CldUploadButton
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            options={{
              multiple: false,
              sources: ["local", "url", "google_drive"],
            }}
            onUpload={(result: any) => {
              handleProfilePhoto(result.info?.secure_url, "update");
            }}
            uploadPreset="bucc_members_profile_photo"
          >
            Upload
          </CldUploadButton>
          <Button
            variant={"link"}
            onClick={() => {
              handleProfilePhoto(profilePhoto!, "remove");
            }}
          >
            Remove
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
