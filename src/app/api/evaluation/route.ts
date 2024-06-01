import dbConnect from "@/lib/dbConnect";
import MemberEBAssesment from "@/model/MemberEBAssesment";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, gSuiteEmail, name, responseObject } = body;
    await dbConnect();
    const memberEB = await MemberEBAssesment.findOne({
      studentId: studentId,
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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const studentID = url.searchParams.get("studentID");
    const evaluationID = url.searchParams.get("evaluationID");

    if (evaluationID) {
      const evaluationData = await MemberEBAssesment.findOne({
        _id: evaluationID,
      });

      if (evaluationData) {
        return NextResponse.json(evaluationData, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Evaluation Data not found" },
          { status: 404 }
        );
      }
    }

    // Till here

    if (studentID) {
      const preregMemberInfo = await PreregMemberInfo.findOne({
        studentId: studentID,
      });

      if (preregMemberInfo) {
        return NextResponse.json(preregMemberInfo, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Student ID not found" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
