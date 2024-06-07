import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import MemberInfo from "@/model/MemberInfo";

export async function GET() {
  await dbConnect();
  const user = await auth();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }
  if (
    user?.user.designation !== "DIRECTOR" &&
    user?.user.designation !== "ASSISTANT DIRECTOR"
  ) {
    return NextResponse.json({
      message: `Designation: ${user?.user.designation} don't have the permission to view this page.`,
    });
  }
  try {
    const users = await MemberInfo.find({
      buccDepartment: user?.user.buccDepartment,
    });
    return NextResponse.json({ users: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
