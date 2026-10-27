import dbConnect from "@/lib/dbConnect";
import EvaluationData from "@/model/EvaluationData";
import PreRegMember from "@/model/PreRegMember";
import { NextRequest, NextResponse } from "next/server";
import { getConfigValue } from "@/helpers/appConfigStore";

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
    const body = await request.json();
    const { _id, interviewTakenBy, modifiedBy, assignedDepartment, status, comment, assignedTasks } = body;

    await dbConnect();
    const evaluation = await EvaluationData.findById(_id);

    if (!evaluation) {
      return NextResponse.json({ message: "Evaluation not found" }, { status: 404 });
    }

    evaluation.status = status;
    evaluation.buccDepartment = assignedDepartment;
    evaluation.interviewTakenBy = interviewTakenBy;
    evaluation.comment = comment;
    evaluation.modifiedBy = modifiedBy;
    if (assignedTasks !== undefined) {
      evaluation.assignedTasks = assignedTasks;
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
      await dbConnect();
      const evaluationData = await EvaluationData.findById(evaluationID);
      if (evaluationData) {
        return NextResponse.json(evaluationData, { status: 200 });
      }
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
