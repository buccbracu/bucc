"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import departments from "@/constants/departments";
import designations from "@/constants/designations";
import skills from "@/constants/skills";
import { getMemberData } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Heading from "../heading";

const OPTIONS: Option[] = skills.map((skill) => ({
  label: skill.label,
  value: skill.label,
}));

interface MemberData {
  profileImage: string;
  name: string;
  studentId: string;
  rfid: string;
  email: string;
  contactNumber: string;
  buccDepartment: string;
  designation: string;
  joinedBucc: string;
  lastPromotion: string;
  joinedBracu: string;
  departmentBracu: string;
  birthDate: string;
  bloodGroup: string;
  gender: string;
  personalEmail: string;
  emergencyContact: string;
  memberStatus: string;
  memberSkills: Option[];
  memberSocials: {
    Facebook: string;
    Linkedin: string;
    Github: string;
  };
}

export default function EditMember({ id }: { id: string }) {
  const memberId = id;

  const { data, refetch } = useQuery({
    queryKey: ["member", memberId],
    queryFn: () => getMemberData(memberId),
  });

  const userData = data?.users[0];

  const initialMemberData: MemberData = {
    profileImage: "",
    name: "",
    studentId: "",
    rfid: "",
    email: "",
    contactNumber: "",
    buccDepartment: "",
    designation: "",
    joinedBucc: "",
    lastPromotion: "",
    joinedBracu: "",
    departmentBracu: "",
    birthDate: "",
    bloodGroup: "",
    gender: "",
    personalEmail: "",
    emergencyContact: "",
    memberStatus: "",
    memberSkills: [],
    memberSocials: {
      Facebook: "",
      Linkedin: "",
      Github: "",
    },
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [memberData, setMemberData] = useState<MemberData>(initialMemberData);
  const [isEditable, setIsEditable] = useState(false);
  const [formSemester, setFormSemester] = useState({
    buccSemester: "",
    buccYear: "",
    promotionSemester: "",
    promotionYear: "",
    bracuSemester: "",
    bracuYear: "",
  });

  useEffect(() => {
    if (userData) {
      const {
        profileImage,
        name,
        studentId,
        rfid,
        email,
        contactNumber,
        buccDepartment,
        designation,
        joinedBucc,
        lastPromotion,
        joinedBracu,
        departmentBracu,
        birthDate,
        bloodGroup,
        gender,
        personalEmail,
        emergencyContact,
        memberStatus,
        memberSkills,
        memberSocials,
      } = userData;

      // Function to parse semester and year from "Semester Year" format
      const parseSemesterYear = (semesterYear: string) => {
        if (semesterYear) {
          const [semester, year] = semesterYear.split(" ");
          return { semester, year };
        }
        return { semester: "", year: "" };
      };

      // Parse joinedBucc, lastPromotion, and joinedBracu
      const parsedJoinedBucc = parseSemesterYear(joinedBucc);
      const parsedLastPromotion = parseSemesterYear(lastPromotion);
      const parsedJoinedBracu = parseSemesterYear(joinedBracu);

      setMemberData({
        profileImage,
        name,
        studentId,
        rfid,
        email,
        contactNumber,
        buccDepartment,
        designation,
        joinedBucc,
        lastPromotion,
        joinedBracu,
        departmentBracu,
        birthDate: birthDate && birthDate.split("T")[0],
        bloodGroup,
        gender,
        personalEmail,
        emergencyContact,
        memberStatus,
        memberSkills: memberSkills
          ? memberSkills.map((skill: any) => ({ label: skill, value: skill }))
          : [],
        memberSocials: memberSocials
          ? {
              Facebook: memberSocials.Facebook,
              Linkedin: memberSocials.Linkedin,
              Github: memberSocials.Github,
            }
          : {
              Facebook: "",
              Linkedin: "",
              Github: "",
            },
      });

      setFormSemester({
        buccSemester: parsedJoinedBucc.semester || "",
        buccYear: parsedJoinedBucc.year || "",
        promotionSemester: parsedLastPromotion.semester || "",
        promotionYear: parsedLastPromotion.year || "",
        bracuSemester: parsedJoinedBracu.semester || "",
        bracuYear: parsedJoinedBracu.year || "",
      });
    }
  }, [userData]);

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
      setMemberData((prevData: any) => ({
        ...prevData,
        [mainId]: {
          ...prevData[mainId],
          [subId]: value,
        },
      }));
    } else {
      setMemberData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSkillsChange = (selectedOptions: Option[]) => {
    setMemberData((prevData) => ({
      ...prevData,
      memberSkills: selectedOptions,
    }));
  };

  const handleEdit = () => {
    if (isEditable) {
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  };

  const handleConfirmation = () => {
    setShowConfirmationModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...memberData,
        joinedBucc: `${formSemester.buccSemester} ${formSemester.buccYear}`,
        lastPromotion: `${formSemester.promotionSemester} ${formSemester.promotionYear}`,
        joinedBracu: `${formSemester.bracuSemester} ${formSemester.bracuYear}`,
        memberSkills: memberData.memberSkills.map((skill) => skill.value),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/?id=${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (res.ok) {
        toast.success("Member updated successfully!");
        setShowConfirmationModal(false);
        setIsEditable(false);
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
    <section className="mb-10">
      <Heading
        headingText="Edit Member"
        subHeadingText="Edit Member's Details here..."
      />
      <div className="flex justify-center">
        <Card className="mx-auto w-full md:w-2/4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4 h-24 w-24">
                  {memberData.profileImage ? (
                    <CldImage
                      width="960"
                      height="600"
                      src={memberData.profileImage}
                      sizes="100vw"
                      alt={`Profile Image of ${memberData.personalEmail}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
                      <span className="text-gray-700">No Image</span>
                    </div>
                  )}
                </div>
              </div>

              <Button className="" variant={"link"} onClick={handleEdit}>
                {isEditable ? "Cancel Editing" : "Edit Member"}
              </Button>

              <div className="col-span-1">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={memberData.name}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="studentId" className="text-right">
                  Student ID
                </Label>
                <Input
                  id="studentId"
                  value={memberData.studentId}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="rfid" className="text-right">
                  RFID
                </Label>
                <Input
                  id="rfid"
                  value={memberData.rfid}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={memberData.email}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="buccDepartment" className="text-right">
                  BUCC Department
                </Label>
                <Select
                  value={memberData.buccDepartment}
                  onValueChange={(value) =>
                    setMemberData((prevData) => ({
                      ...prevData,
                      buccDepartment: value,
                    }))
                  }
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select BUCC Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {departments.slice(2).map((department) => (
                        <SelectItem
                          key={department.title}
                          value={department.title}
                        >
                          {department.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label htmlFor="designation" className="text-right">
                  Designation
                </Label>
                <Select
                  value={memberData.designation}
                  onValueChange={(value) =>
                    setMemberData((prevData) => ({
                      ...prevData,
                      designation: value,
                    }))
                  }
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select BUCC Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {designations.slice(2).map((designation) => (
                        <SelectItem
                          key={designation.title}
                          value={designation.title}
                        >
                          {designation.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label htmlFor="joinedBucc" className="text-right">
                  Joined BUCC
                </Label>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <Select
                      value={formSemester.buccSemester}
                      onValueChange={(value) =>
                        setFormSemester((prev) => ({
                          ...prev,
                          buccSemester: value,
                        }))
                      }
                      disabled={!isEditable}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                          <SelectItem value="Fall">Fall</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    id="buccYear"
                    type="number"
                    value={formSemester.buccYear}
                    onChange={(e) =>
                      setFormSemester((prev) => ({
                        ...prev,
                        buccYear: e.target.value,
                      }))
                    }
                    disabled={!isEditable}
                    className="w-1/2"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <Label htmlFor="lastPromotion" className="text-right">
                  Last Promotion
                </Label>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Select
                      value={formSemester.promotionSemester}
                      onValueChange={(value) =>
                        setFormSemester((prev) => ({
                          ...prev,
                          promotionSemester: value,
                        }))
                      }
                      disabled={!isEditable}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                          <SelectItem value="Fall">Fall</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    id="promotionYear"
                    type="number"
                    value={formSemester.promotionYear}
                    onChange={(e) =>
                      setFormSemester((prev) => ({
                        ...prev,
                        promotionYear: e.target.value,
                      }))
                    }
                    disabled={!isEditable}
                    className="w-1/2"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <Label htmlFor="joinedBracu" className="text-right">
                  Joined BRACU
                </Label>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Select
                      value={formSemester.bracuSemester}
                      onValueChange={(value) =>
                        setFormSemester((prev) => ({
                          ...prev,
                          bracuSemester: value,
                        }))
                      }
                      disabled={!isEditable}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                          <SelectItem value="Fall">Fall</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    id="bracuYear"
                    type="number"
                    value={formSemester.bracuYear}
                    onChange={(e) =>
                      setFormSemester((prev) => ({
                        ...prev,
                        bracuYear: e.target.value,
                      }))
                    }
                    disabled={!isEditable}
                    className="w-1/2"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <Label htmlFor="departmentBracu" className="text-right">
                  Department BRACU
                </Label>
                <Input
                  id="departmentBracu"
                  value={memberData.departmentBracu}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="memberStatus" className="text-right">
                  Member Status
                </Label>
                <Input
                  id="memberStatus"
                  value={memberData.memberStatus}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="personalEmail" className="text-right">
                  Personal Email
                </Label>
                <Input
                  id="personalEmail"
                  type="email"
                  value={memberData.personalEmail}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="contactNumber" className="text-right">
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  value={memberData.contactNumber}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="birthDate" className="text-right">
                  Birthday
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={memberData.birthDate}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="bloodGroup" className="text-right">
                  Blood Group
                </Label>
                <Select
                  value={memberData.bloodGroup}
                  onValueChange={(value) =>
                    setMemberData((prevData) => ({
                      ...prevData,
                      bloodGroup: value,
                    }))
                  }
                  disabled={!isEditable}
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
                  value={memberData.gender}
                  onValueChange={(value) =>
                    setMemberData((prevData) => ({
                      ...prevData,
                      gender: value,
                    }))
                  }
                  disabled={!isEditable}
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
                  value={memberData.emergencyContact}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label className="-mb-3">Skills</Label>
                <MultipleSelector
                  value={memberData.memberSkills}
                  defaultOptions={OPTIONS}
                  placeholder="Add member skills..."
                  onChange={handleSkillsChange}
                  disabled={!isEditable}
                  creatable
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      No results found.
                    </p>
                  }
                  className={
                    isEditable
                      ? "dark:bg-background-dark bg-background"
                      : "dark:bg-background-dark cursor-not-allowed bg-background opacity-50"
                  }
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="memberSocials.Facebook" className="text-right">
                  Facebook
                </Label>
                <Input
                  id="memberSocials.Facebook"
                  value={memberData.memberSocials.Facebook}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="memberSocials.Linkedin" className="text-right">
                  LinkedIn
                </Label>
                <Input
                  id="memberSocials.Linkedin"
                  value={memberData.memberSocials.Linkedin}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="memberSocials.Github" className="text-right">
                  GitHub
                </Label>
                <Input
                  id="memberSocials.Github"
                  value={memberData.memberSocials.Github}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="flex justify-end py-4">
              <Button onClick={handleConfirmation} disabled={!isEditable}>
                Save changes
              </Button>
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
