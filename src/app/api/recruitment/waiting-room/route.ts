import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import EvaluationData from "@/model/EvaluationData";
import PreRegMember from "@/model/PreRegMember";
import { getConfigValue } from "@/helpers/appConfigStore";
import {
  isAlumniMember,
  canManageWaitingRoomCoordinators,
  hasGeneralRecruitmentAccess,
} from "@/lib/permissions";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (isAlumniMember(user)) {
      return NextResponse.json({ error: "Forbidden: Alumni cannot access waiting room" }, { status: 403 });
    }

    const [recruitmentConfig, waitingRoomConfig] = await Promise.all([
      getConfigValue("recruitment_config", { allowSERecruitmentAccess: false }),
      getConfigValue("waiting_room_config", { assignedCoordinators: [] as string[] }),
    ]);

    const canManageCoordinators = canManageWaitingRoomCoordinators(user);
    const assignedCoordinators: string[] = waitingRoomConfig?.assignedCoordinators || [];
    
    const isAssigned = assignedCoordinators.some((coord: string) => {
      const c = coord?.toLowerCase().trim();
      return (
        c === user.studentId?.toLowerCase().trim() ||
        c === user.id ||
        c === user._id?.toString()
      );
    });

    const canModify = canManageCoordinators || isAssigned;
    const hasRecruitment = hasGeneralRecruitmentAccess(user, recruitmentConfig?.allowSERecruitmentAccess);
    const canView = canModify || hasRecruitment;

    if (!canView) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to view the waiting room" },
        { status: 403 }
      );
    }

    await dbConnect();

    const candidates = await EvaluationData.find({
      waitingRoomStatus: { $in: ["Waiting", "Sent to Board"] },
    })
      .select("name studentId buccDepartment waitingRoomStatus waitingRoomCheckedInAt")
      .sort({ waitingRoomCheckedInAt: 1 })
      .lean();

    return NextResponse.json({
      candidates,
      permissions: {
        canModify,
        canManageCoordinators,
      },
    });
  } catch (error: any) {
    console.error("Waiting room fetch error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (isAlumniMember(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const waitingRoomConfig = await getConfigValue("waiting_room_config", {
      assignedCoordinators: [] as string[],
    });

    const canManageCoordinators = canManageWaitingRoomCoordinators(user);
    const assignedCoordinators: string[] = waitingRoomConfig?.assignedCoordinators || [];
    const isAssigned = assignedCoordinators.some((coord: string) => {
      const c = coord?.toLowerCase().trim();
      return (
        c === user.studentId?.toLowerCase().trim() ||
        c === user.id ||
        c === user._id?.toString()
      );
    });

    const canModify = canManageCoordinators || isAssigned;
    if (!canModify) {
      return NextResponse.json(
        { error: "Forbidden: Only authorized coordinators can modify the waiting room queue" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const studentId = body?.studentId?.toString().trim();

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if candidate submitted the evaluation form
    const evaluation = await EvaluationData.findOne({
      studentId: { $regex: new RegExp(`^${studentId}$`, "i") },
    });

    if (evaluation) {
      // Check if already in waiting room
      if (evaluation.waitingRoomStatus && ["Waiting", "Sent to Board"].includes(evaluation.waitingRoomStatus)) {
        return NextResponse.json(
          {
            error: "ALREADY_CHECKED_IN",
            message: `${evaluation.name} (${evaluation.studentId}) is already in the waiting room (${evaluation.waitingRoomStatus}).`,
            candidate: evaluation,
          },
          { status: 400 }
        );
      }

      evaluation.waitingRoomStatus = "Waiting";
      evaluation.waitingRoomCheckedInAt = new Date();
      await evaluation.save();

      return NextResponse.json({
        success: true,
        message: `Checked in ${evaluation.name} (${evaluation.studentId}) to Waiting Room.`,
        candidate: {
          _id: evaluation._id,
          name: evaluation.name,
          studentId: evaluation.studentId,
          buccDepartment: evaluation.buccDepartment,
          waitingRoomStatus: evaluation.waitingRoomStatus,
          waitingRoomCheckedInAt: evaluation.waitingRoomCheckedInAt,
        },
      });
    }

    // Evaluation not found -> check if they pre-registered
    const preReg = await PreRegMember.findOne({
      studentId: { $regex: new RegExp(`^${studentId}$`, "i") },
    });

    if (preReg) {
      return NextResponse.json(
        {
          error: "EVALUATION_MISSING",
          message: `${preReg.name} (${preReg.studentId}) has pre-registered, but has NOT submitted the /evaluation form yet.`,
          name: preReg.name,
          studentId: preReg.studentId,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "NOT_FOUND",
        message: `Student ID "${studentId}" was not found in recruitment pre-registration records.`,
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Waiting room check-in error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (isAlumniMember(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const waitingRoomConfig = await getConfigValue("waiting_room_config", {
      assignedCoordinators: [] as string[],
    });

    const canManageCoordinators = canManageWaitingRoomCoordinators(user);
    const assignedCoordinators: string[] = waitingRoomConfig?.assignedCoordinators || [];
    const isAssigned = assignedCoordinators.some((coord: string) => {
      const c = coord?.toLowerCase().trim();
      return (
        c === user.studentId?.toLowerCase().trim() ||
        c === user.id ||
        c === user._id?.toString()
      );
    });

    const canModify = canManageCoordinators || isAssigned;
    if (!canModify) {
      return NextResponse.json(
        { error: "Forbidden: Only authorized coordinators can update the waiting room queue" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { evaluationId, status } = body;

    if (!evaluationId) {
      return NextResponse.json({ error: "Evaluation ID is required" }, { status: 400 });
    }

    await dbConnect();

    if (status === null || status === "remove") {
      await EvaluationData.findByIdAndUpdate(evaluationId, {
        $set: { waitingRoomStatus: null, waitingRoomCheckedInAt: null },
      });
      return NextResponse.json({
        success: true,
        message: "Candidate removed from waiting room queue.",
      });
    }

    if (!["Waiting", "Sent to Board"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await EvaluationData.findByIdAndUpdate(
      evaluationId,
      { $set: { waitingRoomStatus: status } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Candidate evaluation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to "${status}" for ${updated.name}`,
      candidate: updated,
    });
  } catch (error: any) {
    console.error("Waiting room status update error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
