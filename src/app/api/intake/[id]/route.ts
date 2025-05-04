import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intake from "@/model/Intake"; 

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  try {
    const { id } = params;
    console.log(id)
    if (!id) {
      return NextResponse.json(
        { message: "Intake ID is required" },
        { status: 400 },
      );
    }

    // Parse the request body
    const updateData = await request.json();

    const updatedIntake = await Intake.findByIdAndUpdate(id, updateData);

    if (!updatedIntake) {
      return NextResponse.json(
        { message: "Intake not found" },
        { status: 404 },
      );
    }

    // Return the updated intake
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