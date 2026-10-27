import { auth } from "@/auth";
import departments from "@/constants/departments";
import designations from "@/constants/designations";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { db } from "@/lib/auth";
import { isSuperUser } from "@/lib/permissions";

const departmentsName = departments.map((department) => department.title);
const designationsName = designations.map((designation) => designation.title);

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    }, { status: 401 });
  }

  const user = session.user as any;
  const isAlumni = 
    user?.memberStatus?.toLowerCase() === "alumni" || 
    user?.designation?.toLowerCase() === "alumni" ||
    (user?.memberStatus && user?.memberStatus?.toLowerCase() !== "active");

  if (isAlumni) {
    return NextResponse.json({
      message: "Alumni do not have permission to view members data.",
    }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const minimal = searchParams.get("minimal");

  if (minimal) {
    try {
      const usersCollection = db.collection("user");
      const query: any = {
        $and: [
          {
            $or: [
              { memberStatus: { $in: ["Active", "active"] } },
              { memberStatus: { $exists: false } }
            ]
          },
          {
            $or: [
              { designation: { $not: { $regex: /alumni/i } } },
              { designation: { $exists: false } }
            ]
          }
        ]
      };

      const designationParam = searchParams.get("designation");
      if (designationParam) {
        query.$and.push({
          designation: { $regex: new RegExp("^" + designationParam.trim() + "$", "i") }
        });
      }

      const users = await usersCollection.find(
        query,
        { projection: { name: 1, designation: 1, buccDepartment: 1, studentId: 1 } }
      ).toArray();

      return NextResponse.json({
        users: users.map((u: any) => ({
          id: u._id.toString(),
          name: u.name,
          studentId: u.studentId,
          designation: u.designation,
          buccDepartment: u.buccDepartment
        }))
      });
    } catch (error) {
      return NextResponse.json({ error: "Failed to search members" }, { status: 500 });
    }
  }

  if (
    !["President", "Vice President", "General Secretary", "Treasurer", "Director", "Assistant Director", "Senior Executive"].includes(
      user.designation
    )
  ) {
    return NextResponse.json({
      message: `Designation: ${user.designation} does not have the permission to view this page.`,
    }, { status: 403 });
  }

  const seView = ["Director", "Assistant Director", "Senior Executive"];
  const ebView = ["Director", "Assistant Director", "Senior Executive", "Executive", "General Member"];
  const gbView = [...designations.map((d: any) => d.title)];

  const isGB = isSuperUser(user);
  
  let view = ebView;
  if (user.designation === "Senior Executive") {
    view = seView;
  } else if (isGB) {
    view = gbView;
  }

  try {
    const usersCollection = db.collection("user");
    
    const filter: any = {
      designation: { $in: view }
    };

    // If not GB, only show members of their own department
    if (!isGB) {
      filter.buccDepartment = user.buccDepartment;
    }

    const projection: any = {};
    if (user.designation === "Senior Executive") {
      projection.email = 1;
      projection.phoneNumber = 1;
      projection.emergencyContact = 1;
      projection.name = 1;
      projection.designation = 1;
      projection.buccDepartment = 1;
      projection.profileImage = 1;
      projection.studentId = 1;
    }

    const members = await usersCollection.find(filter, { projection }).toArray();

    // Custom sorting logic
    members.sort((a: any, b: any) => {
      const deptA = a.buccDepartment || "";
      const deptB = b.buccDepartment || "";
      const desA = a.designation || "";
      const desB = b.designation || "";

      const departmentComparison = departmentsName.indexOf(deptA) - departmentsName.indexOf(deptB);
      if (departmentComparison !== 0) return departmentComparison;

      return designationsName.indexOf(desA) - designationsName.indexOf(desB);
    });

    return NextResponse.json({ users: members });
  } catch (error: any) {
    console.error("Fetch members error:", error);
    return NextResponse.json({
      message: "An error occurred while fetching members.",
      error: error.message,
    }, { status: 500 });
  }
}
