const saltRounds = 10;
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserAuth from "@/model/UserAuth";
import { hash } from "bcrypt";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    await dbConnect();

    const member = await UserAuth.findOne({ email: email });

    if (member) {
      console.log("User already exists");
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const hashPass = await hash(password, saltRounds);
    const newMember = new UserAuth({
      name,
      email,
      password: hashPass,
    });

    await newMember.save();

    console.log(body);

    return NextResponse.json(
      { message: "Register Successful" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
