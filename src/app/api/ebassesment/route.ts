import MemberEBAssesment from "@/model/MemberEBAssesment";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const {
      _id,
      interviewTakenBy,
      modifiedBy,
      assignedDepartment,
      status,
      comment,
    } = await request.json();

    const assessmentData = {
      modifiedBy,
      buccDepartment: assignedDepartment,
      status,
      comment,
    };

    const assessment = await MemberEBAssesment.findOne({ _id });

    assessment.interviewTakenBy = [];

    assessment.interviewTakenBy.push(...interviewTakenBy);

    assessment.set(assessmentData);

    await assessment.save();

    return NextResponse.json(
      { message: "Evaluation updated successfully", assessment },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
