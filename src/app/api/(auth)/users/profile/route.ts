import { hasAuth } from "@/helpers/hasAuth";
import MemberInfo from "@/model/MemberInfo";
import { NextRequest, NextResponse } from "next/server";

const permittedFields = [
  "personalEmail",
  "contactNumber",
  "profileImage",
  "birthDate",
  "bloodGroup",
  "gender",
  "emergencyContact",
  "memberSkills",
  "memberSocials",
];

export async function GET() {
  const { session, isPermitted } = await hasAuth();

  if (!session || !isPermitted) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  try {
    const users = await MemberInfo.findByIdAndUpdate(session?.user.id);
    return NextResponse.json({ user: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}

export async function PATCH(request: NextRequest) {
  const { session, isPermitted } = await hasAuth();
  const userID = session?.user.id;

  if (!session) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
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
    const user = await MemberInfo.findById(userID);

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
      userID,
      { $set: updateObject },
      { new: true },
    );

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
