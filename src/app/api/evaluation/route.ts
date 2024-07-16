import dbConnect from "@/lib/dbConnect";
import MemberEBAssessment from "@/model/MemberEBAssessment";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, gSuiteEmail, name, responseObject, firstChoice } = body;
    await dbConnect();
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

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Evaluations!A1:C1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[studentId, name, firstChoice]],
      },
    });

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
    await dbConnect();

    const url = new URL(request.url);
    const studentID = url.searchParams.get("studentID");
    const evaluationID = url.searchParams.get("evaluationID");

    if (evaluationID) {
      const evaluationData = await MemberEBAssessment.findOne({
        _id: evaluationID,
      });

      if (evaluationData) {
        return NextResponse.json(evaluationData, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Evaluation Data not found" },
          { status: 404 },
        );
      }
    }

    if (studentID) {
      const preregMemberInfo = await PreregMemberInfo.findOne({
        studentId: studentID,
      });

      const evaluationData = await MemberEBAssessment.findOne({
        studentId: studentID,
      });

      if (evaluationData) {
        return NextResponse.json(
          { message: "Evaluation already submitted" },
          { status: 400 },
        );
      }

      if (preregMemberInfo) {
        return NextResponse.json(
          { message: "Preregistration already done" },
          { status: 200 },
        );
      }
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
