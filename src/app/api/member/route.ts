import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextRequest, NextResponse } from "next/server";

const permittedDepartments = ["Governing Body", "Human Resources"];
const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];
const permittedFields = [
  "name",
  "studentId",
  "email",
  "buccDepartment",
  "designation",
  "personalEmail",
  "contactNumber",
  "joinedBracu",
  "departmentBracu",
  "profileImage",
  "rfid",
  "birthDate",
  "bloodGroup",
  "gender",
  "emergencyContact",
  "joinedBucc",
  "lastPromotion",
  "memberStatus",
  "memberSkills",
  "memberSocials",
];

export async function GET(request: NextRequest) {
  await dbConnect();

  const url = new URL(request.url);
  const MemberID = url.searchParams.get("id");

  const user = await auth();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }

  try {
    const users = await MemberInfo.findById(MemberID);

    if (!users) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    return NextResponse.json({ user: users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await dbConnect();

  const url = new URL(request.url);
  const memberID = url.searchParams.get("id");

  const session = await auth();

  if (!session) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }

  if (
    !permittedDesignations.includes(session.user.designation) ||
    !permittedDepartments.includes(session.user.buccDepartment)
  ) {
    return NextResponse.json({
      message: "You are not authorized to update this user",
    });
  }

  const body = await request.json();

  const allowedFields = permittedFields;

  //Check if it is a valid request
  const keys = Object.keys(body);
  const isValid = keys.every((key) => allowedFields.includes(key));

  if (!isValid) {
    return NextResponse.json({
      message: "Invalid Request. You are not authorized to update these fields",
    });
  }

  try {
    const user = await MemberInfo.findById(memberID);

    if (!user) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    const { memberSkills, memberSocials, ...otherFields } = body;

    let updateObject: any = {};

    if (memberSocials) {
      const socialKeys = Object.keys(memberSocials);

      for (let key of socialKeys) {
        if (!["Facebook", "Github", "Linkedin"].includes(key)) {
          return NextResponse.json({
            message:
              "Invalid Request. You are not authorized to update these fields",
          });
        }
      }
      updateObject.memberSocials = {
        ...user.memberSocials,
        ...body.memberSocials,
      };
    }

    // Handle skill updates
    if (body.memberSkills) {
      updateObject.memberSkills = [
        ...body.memberSkills.filter((skill: any) => skill),
      ].filter((value, index, self) => value && self.indexOf(value) === index);
    }

    // Merge other fields
    Object.keys(body).forEach((key) => {
      if (key !== "memberSocials" && key !== "memberSkills") {
        updateObject[key] = body[key];
      }
    });

    const updatedUser = await MemberInfo.findByIdAndUpdate(
      memberID,
      { $set: updateObject },
      { new: true },
    );

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
