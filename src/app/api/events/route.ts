import { hasAuth } from "@/helpers/hasAuth";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema/events";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = ["Director", "Assistant Director"];
const permittedDepartments = ["Press Release and Publications"];

export async function POST(request: NextRequest) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to create events" },
      { status: 401 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or missing JSON body" },
      { status: 400 },
    );
  }

  try {
    const {
      title,
      venue,
      description,
      type,
      featuredImage,
      needAttendance,
      startingDate,
      endingDate,
      allowedMembers,
      allowedDepartments,
      allowedDesignations,
      notes,
    } = body;

    if (
      !title ||
      !venue ||
      !description ||
      !type ||
      !startingDate ||
      !endingDate ||
      !allowedMembers
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newEvent = await db
      .insert(events)
      .values({
        title,
        venue,
        description,
        type,
        needAttendance: needAttendance ?? false,
        startingDate: new Date(startingDate),
        endingDate: new Date(endingDate),
        allowedMembers,
        featuredImage: featuredImage || null,
        allowedDepartments: allowedDepartments || [],
        allowedDesignations: allowedDesignations || [],
        notes: notes || "",
        prId: null,
      })
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt));

    return NextResponse.json(allEvents, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
