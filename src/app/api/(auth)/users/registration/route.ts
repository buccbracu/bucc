import dbConnect from "@/lib/dbConnect";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, name, joinedBracu, departmentBracu, email } = body;

    await dbConnect();

    const member = await PreregMemberInfo.findOne({ email: email });

    if (member) {
      console.log("User already exists");
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const newMember = new PreregMemberInfo({
      studentId,
      name,
      joinedBracu,
      departmentBracu,
      email,
    });

    await newMember.save();

    console.log(body);

    return NextResponse.json(
      { message: "Registration Successful" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
