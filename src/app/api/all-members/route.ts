import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const user = await auth();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }
  if (user?.user.buccDepartment !== "HUMAN RESOURCES") {
    return NextResponse.json({
      message: "Only HR Department has access to all-members",
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
    const users = await MemberInfo.find({});
    return NextResponse.json({ user: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
