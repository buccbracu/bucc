import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { NextResponse } from "next/server";

const permittedDepartments = ["GOVERNING BODY", "HUMAN RESOURCES"];
const permittedDesignations = [
  "PRESIDENT",
  "VICE PRESIDENT",
  "GENERAL SECRETARY",
  "TREASURER",
  "DIRECTOR",
  "ASSISTANT DIRECTOR",
];

export async function GET() {
  await dbConnect();
  const user = await auth();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }
  //   if (
  //     !permittedDepartments.includes(user?.user.buccDepartment) ||
  //     !permittedDesignations.includes(user?.user.designation)
  //   ) {
  //     return NextResponse.json({
  //       message: `${user?.user.designation}S of ${user?.user.buccDepartment} don't have the permission to view this page.`,
  //     });
  //   }

  try {
    const users = await PreregMemberInfo.find({});
    return NextResponse.json({ users: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
