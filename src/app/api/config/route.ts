import { NextResponse } from "next/server";
import { getConfigValue, setConfigValue } from "@/helpers/appConfigStore";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isSuperUser, isAlumniMember, canManageWaitingRoomCoordinators, canManageRecruitmentConfig } from "@/lib/permissions";
import { logActivity } from "@/helpers/activityLogger";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key"); 
  const defaultValue = searchParams.get("defaultValue");

  if (!key || typeof key !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid config key" },
      { status: 400 },
    );
  }

  try {
    const value: any = await getConfigValue(key, defaultValue || null);
    
    // Inject specific BUCC defaults for recruitment
    if (key === "recruitment_config" && value && typeof value === "object") {
      if (!value.registrationMessage) {
        value.registrationMessage = "BUCC Recruitment Process is not ongoing. Please check our Facebook page for updates.";
      }
      if (!value.evaluationMessage) {
        value.evaluationMessage = "BUCC is not accepting any more evaluations. Please contact HR or GB.";
      }
    }

    return NextResponse.json({ key, value });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching config", details: error },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate the session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (isAlumniMember(user)) {
      return NextResponse.json({ error: "Forbidden: Alumni cannot modify configuration" }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid config key" },
        { status: 400 },
      );
    }

    // 2. Strict Role-Based Access Control (RBAC)
    if (key === "waiting_room_config") {
      if (!canManageWaitingRoomCoordinators(user)) {
        return NextResponse.json(
          { error: "Forbidden: Only Governing Body, R&D EB, and HR EB can update waiting room configuration." },
          { status: 403 }
        );
      }
    } else if (key === "recruitment_config") {
      if (!canManageRecruitmentConfig(user)) {
        return NextResponse.json(
          { error: "Forbidden: Only Governing Body, R&D EB, and HR EB can update recruitment configuration." },
          { status: 403 }
        );
      }
    } else {
      // All other configuration keys are strictly restricted to Superusers (GB + R&D Admin)
      if (!isSuperUser(user)) {
        return NextResponse.json(
          { error: "Forbidden: You do not have permission to update system configuration." },
          { status: 403 }
        );
      }
    }

    // 3. Update the configuration
    await setConfigValue(key, value);

    // 4. Log the configuration change in Activity Logs
    logActivity({
      actor: {
        id: user.id || user._id,
        name: user.name || "Unknown",
        email: user.email || "",
        designation: user.designation,
        department: user.buccDepartment || user.department,
      },
      method: "POST",
      category: key === "recruitment_config" || key === "waiting_room_config" ? "Recruitment" : "System",
      action: "UPDATE_CONFIG",
      summary: `${user.name || "User"} updated ${key} configuration`,
      targetId: key,
      details: {
        field: key,
        newValue: value,
      },
    });
    
    return NextResponse.json({
      key,
      value,
      message: "Config updated successfully",
    });
  } catch (error) {
    console.error("Config API Error:", error);
    return NextResponse.json(
      { error: "Error updating config", details: error },
      { status: 500 },
    );
  }
}
