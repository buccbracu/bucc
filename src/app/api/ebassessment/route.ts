import { hasAuth } from "@/helpers/hasAuth";
import MemberEBAssessment from "@/model/MemberEBAssessment";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = ["Director", "Assistant Director"];

export async function GET() {
  try {
    const { session, isPermitted } = await hasAuth(permittedDesignations);

    if (!session || !isPermitted) {
      return NextResponse.json(
        { error: "You are not authorized to view this page" },
        { status: 401 },
      );
    }

    const assessment = await MemberEBAssessment.find({});
    return NextResponse.json({ messages: assessment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const {
      _id,
      interviewTakenBy,
      modifiedBy,
      assignedDepartment,
      status,
      comment,
    } = await request.json();

    const { session, isPermitted } = await hasAuth(permittedDesignations);

    if (!session || !isPermitted) {
      return NextResponse.json({
        message: "You are not authorized to view this page",
      });
    }

    const assessmentData = {
      modifiedBy,
      buccDepartment: assignedDepartment,
      status,
      comment,
    };

    const assessment = await MemberEBAssessment.findOne({ _id });

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 },
      );
    }

    assessment.interviewTakenBy = [];

    assessment.interviewTakenBy.push(...interviewTakenBy);

    assessment.set(assessmentData);

    await assessment.save();

    return NextResponse.json(
      { message: "Evaluation updated successfully", assessment },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
