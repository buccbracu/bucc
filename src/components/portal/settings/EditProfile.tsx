"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMember } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const session = useSession();
  const memberID = session?.data?.user.id;

  const { data } = useQuery({
    queryKey: ["member", memberID],
    queryFn: ({ queryKey }) => getMember(queryKey[1]),
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [skills, setSkills] = useState(data?.user?.memberSkills || []);

  const [profileData, setProfileData] = useState({
    personalEmail: data?.user?.personalEmail || "",
    contactNumber: data?.user?.contactNumber || "",
    profileImage: data?.user?.profileImage || "",
    birthday: data?.user?.birthday || "",
    bloodGroup: data?.user?.bloodGroup || "",
    gender: data?.user?.gender || "",
    emergencyContact: data?.user?.emergencyContact || "",
    memberSkills: skills,
    socialLinks: {
      facebook: data?.user?.socialLinks?.facebook || "",
      linkedIn: data?.user?.socialLinks?.linkedIn || "",
      GitHub: data?.user?.socialLinks?.GitHub || "",
    },
  });

  useEffect(() => {
    setProfileData((prevData) => ({
      ...prevData,
      memberSkills: skills,
    }));
  }, [skills]);

  const handleChange = (e: any) => {
    const { id, value, files } = e.target;
    if (id.startsWith("socialLinks")) {
      const key = id.split(".")[1];
      setProfileData((prevData) => ({
        ...prevData,
        socialLinks: {
          ...prevData.socialLinks,
          [key]: value,
        },
      }));
    } else {
      setProfileData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleConfirmation = () => {
    if (showEditModal) {
      setShowConfirmationModal(true);
      setShowEditModal(false);
    } else {
      setShowEditModal(true);
      setShowConfirmationModal(false);
    }
  };

  const handleSaveChanges = async () => {
    setShowConfirmationModal(false);
    console.log(profileData);
  };

  return (
    <div>
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <Card className="sm:w-full">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardFooter>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setShowEditModal(true)}>
                Edit Profile
              </Button>
            </DialogTrigger>
          </CardFooter>
        </Card>
        <DialogContent className="my-4 sm:max-w-[425px] overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="flex justify-center items-center flex-col">
              <div className="relative w-24 h-24 mb-4">
                {profileData.profileImage ? (
                  <Image
                    src={profileData.profileImage}
                    height={100}
                    width={100}
                    alt={`Profile Image of ${data?.user?.name}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-700">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                <Button variant="outline">Upload Image</Button>
                <Button variant="outline">Remove Image</Button>
              </div>
            </div>
            <div className="col-span-1">
              <Label htmlFor="personalEmail" className="text-right">
                Personal Email
              </Label>
              <Input
                id="personalEmail"
                type="email"
                value={profileData.personalEmail}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="contactNumber" className="text-right">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                value={profileData.contactNumber}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="birthday" className="text-right">
                Birthday
              </Label>
              <Input
                id="birthday"
                type="date"
                value={profileData.birthday}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="bloodGroup" className="text-right">
                Blood Group
              </Label>
              <Select
                value={profileData.bloodGroup}
                onValueChange={(value) =>
                  setProfileData((prevData) => ({
                    ...prevData,
                    bloodGroup: value,
                  }))
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="A+">A+ (ve)</SelectItem>
                    <SelectItem value="A-">A- (ve)</SelectItem>
                    <SelectItem value="B+">B+ (ve)</SelectItem>
                    <SelectItem value="B-">B- (ve)</SelectItem>
                    <SelectItem value="AB+">AB+ (ve)</SelectItem>
                    <SelectItem value="AB-">AB- (ve)</SelectItem>
                    <SelectItem value="O+">O+ (ve)</SelectItem>
                    <SelectItem value="O-">O- (ve)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <Input
                id="gender"
                value={profileData.gender}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="emergencyContact" className="text-right">
                Emergency Contact
              </Label>
              <Input
                id="emergencyContact"
                value={profileData.emergencyContact}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="memberSkills" className="text-right">
                Skills
              </Label>
              <MultipleSelector
                defaultOptions={profileData.memberSkills}
                placeholder="Add your skills..."
                onChange={setSkills}
                creatable
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    no results found.
                  </p>
                }
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="socialLinks.facebook" className="text-right">
                Facebook
              </Label>
              <Input
                id="socialLinks.facebook"
                value={profileData.socialLinks.facebook}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="socialLinks.linkedIn" className="text-right">
                LinkedIn
              </Label>
              <Input
                id="socialLinks.linkedIn"
                value={profileData.socialLinks.linkedIn}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="socialLinks.GitHub" className="text-right">
                GitHub
              </Label>
              <Input
                id="socialLinks.GitHub"
                value={profileData.socialLinks.GitHub}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save the changes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSaveChanges} className="w-full">
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleConfirmation}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
