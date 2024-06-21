import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserAuth from "@/model/UserAuth";
import { compare, hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();
    const userID = session?.user?.id;

    if (!userID) {
      return NextResponse.json(
        { message: "You are not authorized to initiate Password Change" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    console.log(currentPassword, newPassword);

    const member = await UserAuth.findById(userID);

    if (!member) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isSameCurrentPassword = await compare(
      currentPassword,
      member.password
    );

    if (!isSameCurrentPassword) {
      return NextResponse.json(
        { message: "Current Password is incorrect" },
        { status: 400 }
      );
    }

    const isSameNewPassword = await compare(newPassword, member.password);

    if (isSameNewPassword) {
      return NextResponse.json(
        { message: "New Password cannot be the same as the current password" },
        { status: 400 }
      );
    }

    const hashPass = await hash(newPassword, 10);

    await UserAuth.findByIdAndUpdate(
      userID,
      { password: hashPass },
      { new: true }
    );

    return NextResponse.json({ message: "Password Changed Successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
