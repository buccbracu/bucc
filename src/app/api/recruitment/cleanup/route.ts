import { hasAuth } from "@/helpers/hasAuth";
import Intake from "@/model/Intake";
import IntervieweeAttendance from "@/model/intervieweeAttendance";
import MemberEBAssessment from "@/model/MemberEBAssessment";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { NextResponse } from "next/server";

const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
];

export async function DELETE() {
  try {
    const { session, isPermitted } = await hasAuth(permittedDesignations);

    if (!session || !isPermitted) {
      return NextResponse.json(
        { error: "You are not authorized to perform this action" },
        { status: 401 },
      );
    }

    // Delete all recruitment data
    const [
      preregDeleted,
      assessmentDeleted,
      attendanceDeleted,
      intakeUpdated,
    ] = await Promise.all([
      PreregMemberInfo.deleteMany({}),
      MemberEBAssessment.deleteMany({}),
      IntervieweeAttendance.deleteMany({}),
      Intake.updateMany(
        { isIntakeActive: true },
        { isIntakeActive: false, isEvaluationActive: false },
      ),
    ]);

    return NextResponse.json(
      {
        message: "Recruitment data cleaned up successfully",
        deleted: {
          preregMembers: preregDeleted.deletedCount,
          assessments: assessmentDeleted.deletedCount,
          attendance: attendanceDeleted.deletedCount,
          intakesDeactivated: intakeUpdated.modifiedCount,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error cleaning up recruitment data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cleanup recruitment data" },
      { status: 500 },
    );
  }
}
