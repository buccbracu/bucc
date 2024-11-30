const saltRounds = 10;
import { auth } from "@/auth";
import generatePassword from "@/helpers/generatePassword";
import { singleWelcomeMail } from "@/helpers/mailer";
import dbConnect from "@/lib/dbConnect";

import { hasAuth } from "@/helpers/hasAuth";
import MemberEBAssessment from "@/model/MemberEBAssessment";
import MemberInfo from "@/model/MemberInfo";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import UserAuth from "@/model/UserAuth";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const permittedDepartments = ["Human Resources"];
const permittedDesignations = ["Director", "Assistant Director"];
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

export async function POST(request: NextRequest) {
  try {
    const { session, isPermitted } = await hasAuth(
      permittedDepartments,
      permittedDesignations,
    );

    if (!session || !isPermitted) {
      return NextResponse.json(
        { message: "You are not authorized to view this page" },
        { status: 401 },
      );
    }

    await dbConnect();

    const body = await request.json();
    const {
      name,
      studentId,
      departmentBracu,
      designation,
      buccDepartment,
      personalEmail,
      gSuiteEmail,
      contactNumber,
      emergencyContact,
      bloodGroup,
      birthDate,
      gender,
      joinedBracu,
      joinedBucc,
      lastPromotion,
      Facebook,
      LinkedIn,
      Github,
    } = body;

    let user = await UserAuth.findOne({ email: gSuiteEmail }).exec();
    let member = await MemberInfo.findOne({ email: gSuiteEmail }).exec();

    if (member && user) {
      return NextResponse.json(
        { message: "Member already exists" },
        { status: 400 },
      );
    }

    const password = generatePassword();
    const hashPass = await hash(password, saltRounds);

    if (user) {
      user.password = hashPass;
      await user.save();

      member = new MemberInfo({
        _id: user._id.toString(),
        name,
        email: gSuiteEmail,
        studentId,
        buccDepartment,
        departmentBracu,
        joinedBracu,
        designation,
        personalEmail,
        contactNumber,
        emergencyContact,
        bloodGroup,
        birthDate,
        gender,
        joinedBucc,
        lastPromotion,
        memberSocials: {
          Facebook,
          LinkedIn,
          Github,
        },
      });

      await member.save();
    } else {
      user = new UserAuth({
        name,
        email: gSuiteEmail,
        password: hashPass,
      });

      await user.save();

      member = new MemberInfo({
        _id: user._id.toString(),
        name,
        email: gSuiteEmail,
        studentId,
        buccDepartment,
        departmentBracu,
        joinedBracu,
        designation,
        personalEmail,
        contactNumber,
        emergencyContact,
        bloodGroup,
        birthDate,
        gender,
        joinedBucc,
        lastPromotion,
        memberSocials: {
          Facebook,
          LinkedIn,
          Github,
        },
      });

      await member.save();
    }

    const createdMember = await MemberInfo.findOne({
      _id: user._id.toString(),
    }).exec();

    if (!createdMember) {
      return NextResponse.json(
        { message: "User not created" },
        { status: 400 },
      );
    }

    await singleWelcomeMail(user._id.toString(), name, gSuiteEmail, password);

    await PreregMemberInfo.findOneAndDelete({ studentId }).exec();
    await MemberEBAssessment.findOneAndDelete({ studentId }).exec();

    return NextResponse.json(
      { message: "Register Successful" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (
      !session ||
      !permittedDesignations.includes(session.user.designation) ||
      !permittedDepartments.includes(session.user.buccDepartment)
    ) {
      return NextResponse.json(
        { message: "You are not authorized to view this page" },
        { status: 401 },
      );
    }

    await dbConnect();

    const body = await request.json();
    const { gSuiteEmail, ...updateFields } = body;

    let member = await MemberInfo.findOne({ email: gSuiteEmail }).exec();
    let user = await UserAuth.findOne({ email: gSuiteEmail }).exec();

    if (!member || !user) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 },
      );
    }

    const updateData: any = {
      memberSocials: {
        Facebook: "",
        LinkedIn: "",
        Github: "",
      },
    };
    for (const key in updateFields) {
      if (permittedFields.includes(key)) {
        updateData[key] = updateFields[key];
      }
      if (key === "Facebook" || key === "LinkedIn" || key === "Github") {
        updateData.memberSocials[key] = updateFields[key];
      }
    }

    await MemberInfo.updateOne(
      { email: gSuiteEmail },
      { $set: updateData },
    ).exec();

    return NextResponse.json({ message: "Update Successful" }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
