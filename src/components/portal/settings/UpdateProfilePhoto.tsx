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

  const handleProfilePhoto = (imageUrl: string, action: string) => {
    if (action === "upload") {
      console.log(imageUrl);
      try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/profileImage`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profileImage: imageUrl }),
        });
      } catch (error) {
        console.error(error);
      }
    }
    if (action === "remove") {
      try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/profileImage`, {
          method: "DELETE",
        }).then((res) => {
          if (res.ok) {
            toast.success("Profile Image Removed");
          } else {
            toast.error("Error Removing Profile Image");
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Card className="sm:w-full h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Update Profile Photo</CardTitle>
        <CardDescription>Update your profile photo.</CardDescription>
      </CardHeader>
      <div className="flex justify-center items-center flex-col">
        <div className="relative w-24 h-24 mb-4">
          {profilePhoto ? (
            <CldImage
              width="960"
              height="600"
              src={profilePhoto}
              sizes="100vw"
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
          <CldUploadButton
            className="font-medium text-sm text-primary underline-offset-4 hover:underline"
            options={{
              multiple: false,
              sources: ["local", "url", "google_drive"],
            }}
            onUpload={(result: any) => {
              handleProfilePhoto(result.info?.secure_url, "upload");
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
