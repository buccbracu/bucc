import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import MemberEBAssessment from "@/model/MemberEBAssessment";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, gSuiteEmail, name, responseObject, firstChoice } = body;

    const { session, isPermitted } = await hasAuth(permittedDesignations);

    if (!session || !isPermitted) {
      return NextResponse.json({
        message: "You are not authorized to view this page",
      });
    }

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
    
    const { session, isPermitted } = await hasAuth(permittedDesignations);

    if (!session || !isPermitted) {
      return NextResponse.json({
        message: "You are not authorized to view this page",
      });
    }

    const url = new URL(request.url);
    const studentID = url.searchParams.get("studentID");
    const evaluationID = url.searchParams.get("evaluationID");

    if (evaluationID) {
      // Check if the evaluation ID exists
      const evaluationData = await MemberEBAssessment.findById(evaluationID);

      if (evaluationData) {
        return NextResponse.json(evaluationData, { status: 200 });
      }
    }

    if (studentID) {
      // Check if the user has already submitted the evaluation
      const evaluationData = await MemberEBAssessment.findOne({
        studentId: studentID,
      });

      if (evaluationData) {
        // Return 400 if evaluation is already submitted
        return NextResponse.json(
          { message: "Evaluation already submitted" },
          { status: 400 },
        );
      }

      // If the evaluation is not submitted, check if the user is pre-registered
      const preregMemberInfo = await PreregMemberInfo.findOne({
        studentId: studentID,
      });

      if (preregMemberInfo) {
        // Return 200 if preregistration is done but no evaluation is submitted yet
        return NextResponse.json(
          { message: "Preregistration completed, proceed to evaluation" },
          { status: 200 },
        );
      }

      // If no preregistration, return appropriate message
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
