import { auth } from "@/auth";
import departments from "@/constants/departments";
import designations from "@/constants/designations";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextResponse } from "next/server";

const departmentsName = departments.map((department) => department.title);
const designationsName = designations.map((designation) => designation.title);

export async function GET() {
  await dbConnect();
  const user = await auth();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }
  if (
    user?.user.designation !== "Director" &&
    user?.user.designation !== "Assistant Director"
  ) {
    return NextResponse.json({
      message: `Designation: ${user?.user.designation} don't have the permission to view this page.`,
    });
  }
  try {
    const users = await MemberInfo.find({
      buccDepartment: user?.user.buccDepartment,
    });

    users.sort((a, b) => {
      const departmentComparison =
        departmentsName.indexOf(a.buccDepartment) -
        departmentsName.indexOf(b.buccDepartment);

      if (departmentComparison !== 0) {
        return departmentComparison;
      }

      return (
        designationsName.indexOf(a.designation) -
        designationsName.indexOf(b.designation)
      );
    });

    return NextResponse.json({ users: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
