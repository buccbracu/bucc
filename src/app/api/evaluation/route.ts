import dbConnect from "@/lib/dbConnect";
import MemberEBAssesment from "@/model/MemberEBAssesment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, gSuiteEmail, name, responseObject } = body;
    await dbConnect();
    const memberEB = await MemberEBAssesment.findOne({
      gSuiteEmail: gSuiteEmail,
    });
    if (memberEB) {
      console.log("Form already submitted");
      return NextResponse.json(
        { message: "Evaluation already submitted" },
        { status: 400 }
      );
    }
    const memberSaveEB = new MemberEBAssesment({
      studentId,
      gSuiteEmail,
      name,
      responseObject,
    });
    await memberSaveEB.save();
    return NextResponse.json(
      { message: "Evaluation submission Successful" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
