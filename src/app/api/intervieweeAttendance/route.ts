import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import IntervieweeAttendance from "@/model/intervieweeAttendance";
import MemberEBAssessment from "@/model/MemberEBAssessment";
import { NextResponse } from "next/server";

const permittedDepartments = ["Governing Body", "Human Resources"];
const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
  "Senior Executive",
];


// GET Request
export async function GET(request: Request) {

  const { session, isPermitted } = await hasAuth(permittedDesignations, permittedDepartments);

 
  if (!session) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  if (!isPermitted) {
    return NextResponse.json(
      { error: `${session?.user.designation}S of ${session?.user.buccDepartment} don't have the permission to view this page.` },
      { status: 401 },
    );
  }


  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  try {
    if (!studentId) {
      const records = await IntervieweeAttendance.find({});
      return NextResponse.json(records, { status: 200 });
    }

    if (studentId) {
      const record = await MemberEBAssessment.findOne({ studentId });
      if (!record) {
        return NextResponse.json(
          { message: "Record not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(record, { status: 200 });
    }

    // Fetch all records if no specific studentId is provided
    const records = await IntervieweeAttendance.find({});
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 },
    );
  }
}

// POST Request
export async function POST(request: Request) {
  const body = await request.json();
  const { studentId, name, firstChoice, sent, hold, comment } = body;

  if (!studentId || !name || !firstChoice) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {

    const { session, isPermitted } = await hasAuth(permittedDesignations, permittedDepartments);

 
    if (!session) {
      return NextResponse.json(
        { error: "You are not authorized to view this page" },
        { status: 401 },
      );
    }
  
    if (!isPermitted) {
      return NextResponse.json(
        { error: `${session?.user.designation}S of ${session?.user.buccDepartment} don't have the permission to view this page.` },
        { status: 401 },
      );
    }

    const newRecord = new IntervieweeAttendance({
      studentId,
      name,
      firstChoice,
      sent: sent ?? false,
      hold: hold ?? false,
      comment: comment ?? "",
    });

    await newRecord.save();

    return NextResponse.json(
      { message: "Record created", record: newRecord },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 },
    );
  }
}

// PATCH Request
export async function PATCH(request: Request) {
  const body = await request.json();
  const { studentId } = body;

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 },
    );
  }

  try {
    const updatedRecord = await IntervieweeAttendance.findOneAndUpdate(
      { studentId },
      body,
      { new: true, runValidators: true },
    );

    if (!updatedRecord) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Record updated", record: updatedRecord },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 },
    );
  }
}
