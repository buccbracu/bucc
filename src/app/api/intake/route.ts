import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intake from "@/model/Intake";
import { auth } from "@/auth";
import { isSuperUser, isAlumniMember } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (isAlumniMember(user) || !isSuperUser(user)) {
      return NextResponse.json(
        { error: "Forbidden: Only Governing Body and R&D leadership can manage recruitment intakes." },
        { status: 403 }
      );
    }

    await dbConnect();

    const { intakeName, intakeStartDate, intakeEndDate, isIntakeActive, isEvaluationActive } = await req.json();

    const newIntake = new Intake({
      intakeName,
      intakeStartDate,
      intakeEndDate,
      isIntakeActive,
      isEvaluationActive,
    });

    await newIntake.save();

    return NextResponse.json({ message: "Intake created successfully", intake: newIntake }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating intake:", error);
    return NextResponse.json({ message: "Failed to create intake", error: error.message }, { status: 500 });
  }
}
