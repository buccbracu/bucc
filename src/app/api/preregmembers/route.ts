import { hasAuth } from "@/helpers/hasAuth";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { NextResponse } from "next/server";

const permittedDepartments = ["Human Resources"];
const permittedDesignations = ["Director", "Assistant Director"];

export async function GET() {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
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
