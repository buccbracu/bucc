import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { getConfigValue, setConfigValue } from "@/helpers/appConfigStore";
import { isAlumniMember, canManageWaitingRoomCoordinators } from "@/lib/permissions";
import { db } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (isAlumniMember(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const config = await getConfigValue("waiting_room_config", {
      assignedCoordinators: [] as string[],
    });

    const assignedStudentIds = config?.assignedCoordinators || [];

    await dbConnect();
    const usersCollection = db.collection("user");
    
    // Fetch profile details for assigned coordinators
    const coordinatorsDetails = await usersCollection
      .find(
        { studentId: { $in: assignedStudentIds } },
        { projection: { name: 1, studentId: 1, designation: 1, buccDepartment: 1 } }
      )
      .toArray();

    return NextResponse.json({
      assignedCoordinators: assignedStudentIds,
      coordinatorsDetails: coordinatorsDetails.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        studentId: c.studentId,
        designation: c.designation,
        buccDepartment: c.buccDepartment,
      })),
      canManageCoordinators: canManageWaitingRoomCoordinators(user),
    });
  } catch (error: any) {
    console.error("Fetch coordinators error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (isAlumniMember(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only GB, R&D EB, and HR EB can manage coordinators
    if (!canManageWaitingRoomCoordinators(user)) {
      return NextResponse.json(
        { error: "Forbidden: Only Governing Body, R&D EB, and HR EB can assign coordinators" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { assignedCoordinators } = body;

    if (!Array.isArray(assignedCoordinators)) {
      return NextResponse.json({ error: "assignedCoordinators must be an array of student IDs" }, { status: 400 });
    }

    // Clean and normalize student IDs
    const cleanIds = Array.from(
      new Set(
        assignedCoordinators
          .map((id: any) => id?.toString().trim())
          .filter(Boolean)
      )
    );

    await setConfigValue("waiting_room_config", { assignedCoordinators: cleanIds });

    return NextResponse.json({
      success: true,
      message: "Desk coordinators updated successfully.",
      assignedCoordinators: cleanIds,
    });
  } catch (error: any) {
    console.error("Update coordinators error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
