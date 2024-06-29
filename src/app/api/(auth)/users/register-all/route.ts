const saltRounds = 10;
import { singleWelcomeMail } from "@/helpers/mailer";
import dbConnect from "@/lib/dbConnect";
import generatePassword from "@/lib/generatePassword";
import MemberInfo from "@/model/MemberInfo";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import UserAuth from "@/model/UserAuth";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, studentId, gSuiteEmail, buccDepartment, status } = body;
    const { departmentBracu, joinedBracu } = await PreregMemberInfo.findOne({
      studentId,
    }).exec();

    if (status !== "Accepted") {
      return NextResponse.json(
        { message: "User is not accepted" },
        { status: 400 },
      );
    }

    const user = await MemberInfo.findOne({ email: gSuiteEmail }).exec();
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const password = generatePassword();
    const hashPass = await hash(password, saltRounds);

    const newUser = new UserAuth({
      name,
      email: gSuiteEmail,
      password: hashPass,
    });

    await newUser.save();

    const userID = await UserAuth.findOne({ email: gSuiteEmail }).exec();
    const newMember = new MemberInfo({
      _id: userID.id.toString(),
      name,
      email: gSuiteEmail,
      studentId,
      buccDepartment,
      departmentBracu,
      joinedBracu,
    });
    await newMember.save();

    await singleWelcomeMail(userID.id.toString(), name, gSuiteEmail, password);

    return NextResponse.json(
      { message: "Register Successful" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
