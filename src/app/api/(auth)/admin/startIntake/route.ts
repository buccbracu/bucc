import dbConnect from "@/lib/dbConnect";
import Intake from "@/model/intake";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    //TODO: ASSESS IF AUTHORIZED
    //TODO: SERVER SIDE VALIDATION for BODY

    const body = await request.json();
    const {
      intake,
      intake_start_date,
      intake_end_date,
      assesment_form_link,
      assesment_sheet_link,
      is_intake_active,
    } = body;

    await dbConnect();

    const intakeInfo = await Intake.find({ intake: intake });

    if (intakeInfo.length > 0) {
      intakeInfo.forEach((intake) => {
        if (
          intake.intake_start_date.getFullYear() ===
          intake_start_date.getFullYear()
        ) {
          return NextResponse.json(
            { message: "Intake already exists for this year" },
            { status: 400 },
          );
        }
      });
    }

    const newIntake = new Intake({
      intake,
      intake_start_date,
      intake_end_date,
      assesment_form_link,
      assesment_sheet_link,
      is_intake_active,
    });

    await newIntake.save();

    return NextResponse.json(
      { message: "Intake Registration Successful" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
