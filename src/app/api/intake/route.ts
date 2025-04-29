import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intake from "@/model/Intake"; 

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { intakeName, intakeStartDate, intakeEndDate, isIntakeActive, isEvaluationActive } = await req.json();

    const newIntake = new Intake({
      intakeName,
      intakeStartDate,
      intakeEndDate,
      isIntakeActive,
      isEvaluationActive,
    });

    await newIntake.save();

    return NextResponse.json({ message: 'Intake created successfully', intake: newIntake }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating intake:', error);
    return NextResponse.json({ message: 'Failed to create intake', error: error.message }, { status: 500 });
  }
}

