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
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import skills from "@/constants/skills";
import { getProfileData } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OPTIONS: Option[] = skills.map((skill) => ({
  label: skill.label,
  value: skill.label,
}));

export default function EditProfile() {
  const { data, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileData,
  });

  const initialProfileData = {
    personalEmail: "",
    contactNumber: "",
    profileImage: "",
    birthDate: "",
    bloodGroup: "",
    gender: "",
    emergencyContact: "",
    memberSkills: [],
    memberSocials: {
      Facebook: "",
      Linkedin: "",
      Github: "",
    },
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);

  useEffect(() => {
    if (data?.user) {
      const {
        personalEmail,
        contactNumber,
        profileImage,
        birthDate,
        bloodGroup,
        gender,
        emergencyContact,
        memberSkills,
        memberSocials,
      } = data.user;

      setProfileData({
        personalEmail,
        contactNumber,
        profileImage,
        birthDate: birthDate && birthDate.split("T")[0],
        bloodGroup,
        gender,
        emergencyContact,
        memberSkills:
          memberSkills &&
          memberSkills.map((skill: any) => ({ label: skill, value: skill })),
        memberSocials: (memberSocials && {
          Facebook: memberSocials.Facebook,
          Linkedin: memberSocials.Linkedin,
          Github: memberSocials.Github,
        }) || {
          Facebook: "",
          Linkedin: "",
          Github: "",
        },
      });
    }
  }, [data]);

  const handleChange = (e: any) => {
    const { target } = e;
    if (!target) {
      console.error("Event target is undefined.");
      return;
    }

    const { id, value } = target;
    if (!id) {
      console.error("Target id is undefined.");
      return;
    }

    const [mainId, subId] = id.split(".");
    if (subId) {
      setProfileData((prevData: any) => ({
        ...prevData,
        [mainId]: {
          ...prevData[mainId],
          [subId]: value,
        },
      }));
    } else {
      setProfileData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSkillsChange = (selectedOptions: Option[]) => {
    setProfileData((prevData: any) => ({
      ...prevData,
      memberSkills: selectedOptions,
    }));
  };

  const handleConfirmation = () => {
    setShowConfirmationModal(true);
    setShowEditModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      const memberData: any = {
        ...profileData,
        memberSkills: profileData.memberSkills.map(
          (skill: Option) => skill.value,
        ),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberData),
        },
      );
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setShowConfirmationModal(false);
        refetch();
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <Card className="flex h-full flex-col justify-between sm:w-full">
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
        <DialogContent className="max-h-screen max-w-sm overflow-y-scroll sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-4 h-24 w-24">
                {profileData.profileImage ? (
                  <CldImage
                    width="960"
                    height="600"
                    src={profileData.profileImage}
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
              <Label htmlFor="birthDate" className="text-right">
                Birthday
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={profileData.birthDate?.split("T")[0]}
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
              <Select
                value={profileData.gender}
                onValueChange={(value) =>
                  setProfileData((prevData) => ({
                    ...prevData,
                    gender: value,
                  }))
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Prefer not to say">
                      Prefer not to say
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                defaultOptions={OPTIONS}
                value={profileData.memberSkills}
                placeholder="Add your skills..."
                onChange={handleSkillsChange}
                creatable
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    No results found.
                  </p>
                }
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="memberSocials.Facebook" className="text-right">
                Facebook
              </Label>
              <Input
                id="memberSocials.Facebook"
                value={profileData.memberSocials.Facebook}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="memberSocials.Linkedin" className="text-right">
                LinkedIn
              </Label>
              <Input
                id="memberSocials.Linkedin"
                value={profileData.memberSocials.Linkedin}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="memberSocials.Github" className="text-right">
                GitHub
              </Label>
              <Input
                id="memberSocials.Github"
                value={profileData.memberSocials.Github}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter className="flex items-end">
            <div className="flex flex-row gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmation}>Save Changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
      >
        <DialogContent className="h-fit max-w-sm rounded-md sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save the changes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-end">
            <div className="flex flex-row gap-2">
              <Button onClick={handleSaveChanges} className="w-full">
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirmationModal(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
