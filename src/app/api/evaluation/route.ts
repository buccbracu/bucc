import dbConnect from "@/lib/dbConnect";
import EvaluationData from "@/model/EvaluationData";
import PreRegMember from "@/model/PreRegMember";
import { NextRequest, NextResponse } from "next/server";
import { getConfigValue } from "@/helpers/appConfigStore";
import { auth } from "@/auth";
import { logEvaluationDiff } from "@/helpers/activityLogger";
import { hasGeneralRecruitmentAccess, isAlumniMember } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // SERVER-SIDE GATING: Check if evaluation is open
    const config: any = await getConfigValue("recruitment_config", { isEvaluationOpen: false });
    if (!config.isEvaluationOpen) {
      return NextResponse.json(
        { message: config.evaluationMessage || "Evaluation is currently closed." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { studentId, name, gSuiteEmail, phoneNumber, bracuDepartment, buccDepartment, responseObject } = body;
    const cleanStudentId = studentId?.trim();
    const cleanEmail = gSuiteEmail?.trim();

    // Check if evaluation already submitted
    const existingEvaluation = await EvaluationData.findOne({ studentId: cleanStudentId });
    if (existingEvaluation) {
      return NextResponse.json(
        { message: "Evaluation already submitted for this Student ID." },
        { status: 400 }
      );
    }

    // Verify candidate has actually pre-registered
    const preReg = await PreRegMember.findOne({
      studentId: cleanStudentId,
    });
    if (!preReg) {
      return NextResponse.json(
        { message: "You must complete recruitment pre-registration before submitting the evaluation form." },
        { status: 403 }
      );
    }

    const newEvaluation = new EvaluationData({
      studentId: cleanStudentId,
      name,
      email: cleanEmail,
      phoneNumber,
      bracuDepartment,
      buccDepartment,
      responseObject,
      status: "Submitted", // NEW: Mark as submitted for the queue
    });

    await newEvaluation.save();

    return NextResponse.json(
      { message: "Evaluation submitted successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Evaluation submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as any;
    if (isAlumniMember(currentUser)) {
      return NextResponse.json({ error: "Forbidden: Alumni cannot modify recruitment evaluations" }, { status: 403 });
    }

    const config = await getConfigValue("recruitment_config", { allowSERecruitmentAccess: false });
    if (!hasGeneralRecruitmentAccess(currentUser, config?.allowSERecruitmentAccess)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to modify recruitment evaluations" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { _id, interviewTakenBy, modifiedBy, assignedDepartment, status, comment, assignedTasks } = body;

    await dbConnect();
    const evaluation = await EvaluationData.findById(_id);

    if (!evaluation) {
      return NextResponse.json({ message: "Evaluation not found" }, { status: 404 });
    }

    const actor = {
      id: currentUser.id || currentUser._id?.toString(),
      name: currentUser.name || "Evaluator",
      email: currentUser.email,
      designation: currentUser.designation,
      department: currentUser.buccDepartment,
    };

    await logEvaluationDiff({
      existing: evaluation,
      incoming: {
        status,
        assignedDepartment,
        comment,
        assignedTasks,
        interviewTakenBy,
      },
      actor,
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    });

    evaluation.status = status;
    evaluation.buccDepartment = assignedDepartment;
    evaluation.interviewTakenBy = interviewTakenBy;
    evaluation.comment = comment;
    evaluation.modifiedBy = modifiedBy;
    if (assignedTasks !== undefined) {
      // Merge tasks while safely preserving candidate submission data (driveLink, githubLink, status, submittedAt)
      if (Array.isArray(assignedTasks) && Array.isArray(evaluation.assignedTasks)) {
        evaluation.assignedTasks = assignedTasks.map((incomingTask: any) => {
          const existing = evaluation.assignedTasks.find(
            (t: any) => t.department?.trim().toLowerCase() === incomingTask.department?.trim().toLowerCase()
          );
          if (existing && existing.status === "submitted") {
            return {
              ...incomingTask,
              driveLink: existing.driveLink || incomingTask.driveLink,
              githubLink: existing.githubLink || incomingTask.githubLink,
              status: "submitted",
              submittedAt: existing.submittedAt || incomingTask.submittedAt,
            };
          }
          return incomingTask;
        });
      } else {
        evaluation.assignedTasks = assignedTasks;
      }
      evaluation.markModified("assignedTasks");
    }

    await evaluation.save();

    return NextResponse.json({ message: "Assessment updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Evaluation update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const studentID = url.searchParams.get("studentID");
    const gSuiteEmail = url.searchParams.get("gSuiteEmail");
    const evaluationID = url.searchParams.get("evaluationID");

    if (evaluationID) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const currentUser = session.user as any;
      if (isAlumniMember(currentUser)) {
        return NextResponse.json({ error: "Forbidden: Alumni cannot view evaluation records" }, { status: 403 });
      }

      const config = await getConfigValue("recruitment_config", { allowSERecruitmentAccess: false });
      if (!hasGeneralRecruitmentAccess(currentUser, config?.allowSERecruitmentAccess)) {
        return NextResponse.json(
          { error: "Forbidden: You do not have permission to view candidate evaluations" },
          { status: 403 }
        );
      }

      await dbConnect();
      const evaluationData = await EvaluationData.findById(evaluationID);
      if (!evaluationData) {
        return NextResponse.json({ message: "Evaluation not found" }, { status: 404 });
      }
      return NextResponse.json(evaluationData, { status: 200 });
    }

    if (studentID && gSuiteEmail) {
      await dbConnect();
      
      const cleanId = studentID.trim();
      const cleanEmail = gSuiteEmail.trim();

      // First check if they already submitted
      const existingEvaluation = await EvaluationData.findOne({ studentId: cleanId });
      if (existingEvaluation) {
        return NextResponse.json(
          { message: "Evaluation already submitted" },
          { status: 400 }
        );
      }

      // If not, find their registration data matching both ID and Email (case-insensitive)
      const preRegMember = await PreRegMember.findOne({ 
        studentId: cleanId,
        email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
      });

      if (preRegMember) {
        return NextResponse.json(
          { 
            message: "Preregistration found", 
            member: preRegMember 
          }, 
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Student record not found with the provided ID and G Suite Email." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Student ID and G Suite Email are required for verification." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
