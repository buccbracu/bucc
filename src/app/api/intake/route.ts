import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intake from "@/model/Intake";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Find the most recent active intake
    const intake = await Intake.findOne().sort({ intakeStartDate: -1 });

    if (!intake) {
      return NextResponse.json(
        { error: "No intake found" },
        { status: 404 }
      );
    }

    return NextResponse.json(intake);
  } catch (error: any) {
    console.error("Error fetching intake:", error);
    return NextResponse.json(
      { error: "Failed to fetch intake" },
      { status: 500 }
    );
  }
}
