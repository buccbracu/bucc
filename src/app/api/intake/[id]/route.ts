import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intake from "@/model/Intake";
import { auth } from "@/auth";
import { isSuperUser, isAlumniMember } from "@/lib/permissions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (isAlumniMember(user) || !isSuperUser(user)) {
      return NextResponse.json(
        { error: "Forbidden: Only Governing Body and R&D leadership can update recruitment intakes." },
        { status: 403 }
      );
    }

    await dbConnect();

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Intake ID is required" },
        { status: 400 },
      );
    }

    // Parse the request body
    const updateData = await request.json();

    const updatedIntake = await Intake.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedIntake) {
      return NextResponse.json(
        { message: "Intake not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Intake updated successfully", intake: updatedIntake },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating intake:", error);
    return NextResponse.json(
      { message: "Failed to update intake", error: error.message },
      { status: 500 },
    );
  }
}
