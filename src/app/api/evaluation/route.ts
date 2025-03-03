import MemberEBAssessment from "@/model/MemberEBAssessment";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, gSuiteEmail, name, responseObject, firstChoice } = body;

    const memberEB = await MemberEBAssessment.findOne({
      studentId: studentId,
    });
    if (memberEB) {
      return NextResponse.json(
        { message: "Evaluation already submitted" },
        { status: 400 },
      );
    }
    const memberSaveEB = new MemberEBAssessment({
      studentId,
      gSuiteEmail,
      name,
      responseObject,
    });

    await memberSaveEB.save();

    return NextResponse.json(
      { message: "Evaluation submission Successful" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {

    const url = new URL(request.url);
    const studentID = url.searchParams.get("studentID");
    const evaluationID = url.searchParams.get("evaluationID");

    if (evaluationID) {

      const evaluationData = await MemberEBAssessment.findById(evaluationID);

      if (evaluationData) {
        return NextResponse.json(evaluationData, { status: 200 });
      }
    }

    if (studentID) {

      const evaluationData = await MemberEBAssessment.findOne({
        studentId: studentID,
      });

      if (evaluationData) {

        return NextResponse.json(
          { message: "Evaluation already submitted" },
          { status: 400 },
        );
      }

      const preregMemberInfo = await PreregMemberInfo.findOne({
        studentId: studentID,
      });

      if (preregMemberInfo) {

        return NextResponse.json(
          { message: "Preregistration completed, proceed to evaluation" },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { message: "You are not preregistered." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Invalid request parameters" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
