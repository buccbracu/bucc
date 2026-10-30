import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import ActivityLog from "@/model/ActivityLog";
import { canAccessTaskSubmissions, isSuperUser } from "@/lib/permissions";
import { logActivity } from "@/helpers/activityLogger";
import { formatCommentText } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

function formatLogsCSV(logs: any[]): string {
  const headers = [
    "Timestamp",
    "Actor Name",
    "Actor Email",
    "Designation",
    "Department",
    "Method",
    "Category",
    "Action",
    "Summary",
    "Target ID",
    "Target Name",
    "Details",
  ];

  const rows: string[] = [];

  for (const log of logs) {
    let detailsStr = "";
    if (log.action === "RECRUITMENT_COMMENT_UPDATE" && log.details) {
      const oldClean = formatCommentText(log.details.oldValue);
      const newClean = formatCommentText(log.details.newValue);
      detailsStr = `Previous Comment: ${oldClean} | Updated Comment: ${newClean}`;
    } else if (log.details && typeof log.details === "object") {
      detailsStr = JSON.stringify(log.details);
    }

    const row = [
      log.createdAt ? new Date(log.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "",
      log.actor?.name || "",
      log.actor?.email || "",
      log.actor?.designation || "",
      log.actor?.department || "",
      log.method || "",
      log.category || "",
      log.action || "",
      log.summary || "",
      log.targetId || "",
      log.targetName || "",
      detailsStr,
    ];

    const escapedRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",");
    rows.push(escapedRow);
  }

  return "\uFEFF" + [headers.map(h => `"${h}"`).join(","), ...rows].join("\r\n");
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (!canAccessTaskSubmissions(user)) {
      return NextResponse.json({ error: "Forbidden: Activity Logs are restricted to GB, R&D, and HR Leadership." }, { status: 403 });
    }

    await dbConnect();

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim() || "";
    const category = url.searchParams.get("category")?.trim() || "";
    const action = url.searchParams.get("action")?.trim() || "";
    const format = url.searchParams.get("format") || "json";
    const stats = url.searchParams.get("stats") === "true";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(500, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));

    if (stats) {
      const [
        totalLogs,
        recruitmentLogs,
        statusChanges,
        commentUpdates,
        memberApprovals,
      ] = await Promise.all([
        ActivityLog.countDocuments(),
        ActivityLog.countDocuments({ category: "Recruitment" }),
        ActivityLog.countDocuments({ action: "RECRUITMENT_STATUS_CHANGE" }),
        ActivityLog.countDocuments({ action: "RECRUITMENT_COMMENT_UPDATE" }),
        ActivityLog.countDocuments({ action: { $in: ["MEMBER_APPROVED", "MEMBER_REJECTED"] } }),
      ]);

      return NextResponse.json({
        total: totalLogs,
        recruitment: recruitmentLogs,
        statusChanges,
        commentUpdates,
        memberApprovals,
      });
    }

    const query: any = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (action && action !== "All") {
      query.action = action;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearch, "i");
      query.$or = [
        { summary: searchRegex },
        { "actor.name": searchRegex },
        { targetName: searchRegex },
        { targetId: searchRegex },
      ];
    }

    // If exporting, fetch all matching logs
    if (format === "csv" || url.searchParams.get("download") === "true") {
      const allLogs = await ActivityLog.find(query).sort({ createdAt: -1 }).limit(2000).lean();

      if (format === "csv") {
        const csv = formatLogsCSV(allLogs);
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": "attachment; filename=activity_logs_export.csv",
          },
        });
      }

      return new NextResponse(JSON.stringify(allLogs, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": "attachment; filename=activity_logs_export.json",
        },
      });
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("[ActivityLog API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    // Strict gating: Only GB and R&D Director/Assistant Director
    if (!isSuperUser(user)) {
      return NextResponse.json(
        { error: "Forbidden: Only Governing Body and R&D leadership can delete activity logs." },
        { status: 403 }
      );
    }

    await dbConnect();

    let startDate: string | null = null;
    let endDate: string | null = null;

    try {
      const body = await request.json();
      startDate = body.startDate || null;
      endDate = body.endDate || null;
    } catch {
      const url = new URL(request.url);
      startDate = url.searchParams.get("startDate");
      endDate = url.searchParams.get("endDate");
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Both startDate and endDate are required to delete logs by date range." },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD or standard ISO date string." },
        { status: 400 }
      );
    }

    // Set boundaries: start of day for start, end of day for end
    if (startDate.length <= 10) {
      start.setHours(0, 0, 0, 0);
    }
    if (endDate.length <= 10) {
      end.setHours(23, 59, 59, 999);
    }

    if (start > end) {
      return NextResponse.json(
        { error: "startDate cannot be later than endDate." },
        { status: 400 }
      );
    }

    const filter = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };

    const result = await ActivityLog.deleteMany(filter);

    // Record the deletion in the audit trail
    logActivity({
      actor: {
        id: user.id || user._id?.toString(),
        name: user.name || "Unknown",
        email: user.email,
        designation: user.designation,
        department: user.buccDepartment,
      },
      action: "LOGS_PURGED",
      category: "System",
      method: "DELETE",
      summary: `${user.name || "A Superuser"} Purged ${result.deletedCount} Activity Logs (${startDate} to ${endDate})`,
      details: {
        newValue: {
          startDate,
          endDate,
          deletedCount: result.deletedCount,
        },
      },
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} log(s) between ${startDate} and ${endDate}.`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("[ActivityLog DELETE Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
