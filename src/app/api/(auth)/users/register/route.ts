const saltRounds = 10;
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
// import UserAuth from "@/model/UserAuth";
import { hash } from "bcrypt";
import MemberInfo from "@/model/MemberInfo";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, studentId, buccDepartment } = body;

    await dbConnect();

    const user = await MemberInfo.findOne({ email: email }).exec();
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const hashPass = await hash(password, saltRounds);
    const newUser = new MemberInfo({
      name,
      email,
      password: hashPass,
      studentId,
      buccDepartment
    });
    await newUser.save();
    // const userID = await UserAuth.findOne({ email: email }).exec();
    // const newMember = new MemberInfo({
    //   _id: userID.id.toString(),
    //   name,
    //   email,
    //   studentId,
    //   buccDepartment,
    // });
    // await newMember.save();
    return NextResponse.json(
      { message: "Register Successful" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
