import { auth } from "@/auth";
import departments from "@/constants/departments";
import designations from "@/constants/designations";
import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextResponse } from "next/server";

const departmentsName = departments.map((department) => department.title);
const designationsName = designations.map((designation) => designation.title);

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

  const { session, isPermitted } = await hasAuth(permittedDesignations, permittedDepartments);

  if (!session) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
  }
  if (!isPermitted) {
    return NextResponse.json({
      message: `${session?.user.designation}S of ${session?.user.buccDepartment} don't have the permission to view this page.`,
    });
  }

  try {
    const users = await MemberInfo.find({});

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

    return NextResponse.json({ user: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
