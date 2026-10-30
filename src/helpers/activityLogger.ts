import dbConnect from "@/lib/dbConnect";
import ActivityLog from "@/model/ActivityLog";
import { formatCommentText } from "@/lib/utils";

export interface LogActivityParams {
  actor: {
    id?: string;
    name: string;
    email?: string;
    designation?: string;
    department?: string;
  };
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  category: "Recruitment" | "Members" | "Events" | "Blogs" | "Projects" | "System";
  action: string;
  summary: string;
  targetId?: string;
  targetName?: string;
  details?: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    metadata?: any;
  };
  ipAddress?: string;
}

/**
 * Non-blocking activity logger that records portal mutations.
 * Failsafe: if logging ever errors, it will not disrupt or fail the primary request.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await dbConnect();
    await ActivityLog.create({
      actor: {
        id: params.actor.id,
        name: params.actor.name || "System User",
        email: params.actor.email,
        designation: params.actor.designation,
        department: params.actor.department,
      },
      method: params.method,
      category: params.category,
      action: params.action,
      summary: params.summary,
      targetId: params.targetId,
      targetName: params.targetName,
      details: params.details || {},
      ipAddress: params.ipAddress,
    });
  } catch (err) {
    console.error("[ActivityLogger] Failed to write log:", err);
  }
}

/**
 * Specialized smart diff logger for candidate recruitment evaluations.
 * Automatically detects status changes (e.g. Rejected -> Accepted),
 * comment overwrites (preserving old comment), department reassignments, and task changes.
 */
export async function logEvaluationDiff({
  existing,
  incoming,
  actor,
  ipAddress,
}: {
  existing: any;
  incoming: {
    status?: string;
    assignedDepartment?: string;
    comment?: any;
    assignedTasks?: any[];
    interviewTakenBy?: string[];
  };
  actor: {
    id?: string;
    name: string;
    email?: string;
    designation?: string;
    department?: string;
  };
  ipAddress?: string;
}): Promise<void> {
  if (!existing || !incoming || !actor) return;

  const candidateIdentifier = `ID: ${existing.studentId} (${existing.name})`;

  // 1. Status Change (e.g. Rejected -> Accepted, or Pending -> Accepted)
  if (incoming.status && incoming.status !== existing.status) {
    const oldStatus = existing.status || "Pending";
    const newStatus = incoming.status;
    await logActivity({
      actor,
      method: "PATCH",
      category: "Recruitment",
      action: "RECRUITMENT_STATUS_CHANGE",
      summary: `${actor.name} changed candidate status from '${oldStatus}' to '${newStatus}' for ${candidateIdentifier}`,
      targetId: existing.studentId,
      targetName: existing.name,
      details: {
        field: "status",
        oldValue: oldStatus,
        newValue: newStatus,
      },
      ipAddress,
    });
  }

  // 2. Comment Overwrites / Updates (Preserves previous comment in oldValue)
  const oldCommentFormatted = formatCommentText(existing.comment);
  const newCommentFormatted = formatCommentText(incoming.comment);

  if (incoming.comment !== undefined && oldCommentFormatted !== newCommentFormatted) {
    await logActivity({
      actor,
      method: "PATCH",
      category: "Recruitment",
      action: "RECRUITMENT_COMMENT_UPDATE",
      summary: `${actor.name} updated evaluation comments for ${candidateIdentifier}`,
      targetId: existing.studentId,
      targetName: existing.name,
      details: {
        field: "comment",
        oldValue: existing.comment,
        newValue: incoming.comment,
      },
      ipAddress,
    });
  }

  // 3. Department Reassignment
  if (incoming.assignedDepartment && incoming.assignedDepartment !== existing.buccDepartment) {
    const oldDept = existing.buccDepartment || "Unassigned";
    const newDept = incoming.assignedDepartment;
    await logActivity({
      actor,
      method: "PATCH",
      category: "Recruitment",
      action: "RECRUITMENT_DEPARTMENT_CHANGE",
      summary: `${actor.name} reassigned department from '${oldDept}' to '${newDept}' for ${candidateIdentifier}`,
      targetId: existing.studentId,
      targetName: existing.name,
      details: {
        field: "buccDepartment",
        oldValue: oldDept,
        newValue: newDept,
      },
      ipAddress,
    });
  }

  // 4. Assigned Tasks Modifications
  if (incoming.assignedTasks !== undefined) {
    const oldTasks = existing.assignedTasks || [];
    const newTasks = incoming.assignedTasks || [];

    // Check newly added tasks
    const addedTasks = newTasks.filter(
      (nt: any) => !oldTasks.some((ot: any) => ot.department === nt.department && ot.title === nt.title)
    );
    // Check removed tasks
    const removedTasks = oldTasks.filter(
      (ot: any) => !newTasks.some((nt: any) => nt.department === ot.department && nt.title === ot.title)
    );

    if (addedTasks.length > 0) {
      for (const t of addedTasks) {
        await logActivity({
          actor,
          method: "PATCH",
          category: "Recruitment",
          action: "RECRUITMENT_TASK_ASSIGNED",
          summary: `${actor.name} assigned '${t.department}' task ('${t.title}') to ${candidateIdentifier}`,
          targetId: existing.studentId,
          targetName: existing.name,
          details: {
            field: "assignedTasks",
            newValue: t,
          },
          ipAddress,
        });
      }
    }

    if (removedTasks.length > 0) {
      for (const t of removedTasks) {
        await logActivity({
          actor,
          method: "PATCH",
          category: "Recruitment",
          action: "RECRUITMENT_TASK_REMOVED",
          summary: `${actor.name} removed '${t.department}' task ('${t.title}') for ${candidateIdentifier}`,
          targetId: existing.studentId,
          targetName: existing.name,
          details: {
            field: "assignedTasks",
            oldValue: t,
          },
          ipAddress,
        });
      }
    }
  }

  // 5. Interview Board Modifications
  if (incoming.interviewTakenBy && Array.isArray(incoming.interviewTakenBy)) {
    const oldBoard = (existing.interviewTakenBy || []).sort().join(", ");
    const newBoard = (incoming.interviewTakenBy || []).sort().join(", ");
    if (oldBoard !== newBoard) {
      await logActivity({
        actor,
        method: "PATCH",
        category: "Recruitment",
        action: "RECRUITMENT_BOARD_UPDATE",
        summary: `${actor.name} updated interview board for ${candidateIdentifier}`,
        targetId: existing.studentId,
        targetName: existing.name,
        details: {
          field: "interviewTakenBy",
          oldValue: existing.interviewTakenBy || [],
          newValue: incoming.interviewTakenBy || [],
        },
        ipAddress,
      });
    }
  }
}
