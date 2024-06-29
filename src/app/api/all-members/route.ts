import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextResponse } from "next/server";

const permittedDepartments = ["Governing Body", "Human Resources"];
const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

export async function GET() {
  await dbConnect();
  const user = await auth();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }
  if (
    !permittedDepartments.includes(user?.user.buccDepartment) ||
    !permittedDesignations.includes(user?.user.designation)
  ) {
    return NextResponse.json({
      message: `${user?.user.designation}S of ${user?.user.buccDepartment} don't have the permission to view this page.`,
    });
  }

  try {
    const users = await MemberInfo.find({});
    return NextResponse.json({ user: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
