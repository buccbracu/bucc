import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intake from "@/model/Intake";
import { hasAuth } from "@/helpers/hasAuth";

const permittedDesignations = [
  "president",
  "vice president",
  "general secretary",
  "treasurer",
  "director",
];

export async function PATCH(request: NextRequest) {
  try {
    const { session, isPermitted } = await hasAuth(permittedDesignations);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isPermitted) {
      return NextResponse.json(
        { error: "You are not authorized to perform this action" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { intakeId, isIntakeActive, isEvaluationActive } = body;

    if (!intakeId) {
      return NextResponse.json(
        { error: "Intake ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof isIntakeActive === "boolean") {
      updateData.isIntakeActive = isIntakeActive;
    }
    if (typeof isEvaluationActive === "boolean") {
      updateData.isEvaluationActive = isEvaluationActive;
    }

    const intake = await Intake.findByIdAndUpdate(
      intakeId,
      updateData,
      { new: true }
    );

    if (!intake) {
      return NextResponse.json(
        { error: "Intake not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ intake });
  } catch (error: any) {
    console.error("Error updating intake:", error);
    return NextResponse.json(
      { error: "Failed to update intake" },
      { status: 500 }
    );
  }
}
