import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = ["Director", "Assistant Director"];
const permittedDepartments = ["Press Release and Publications"];

export async function POST(request: NextRequest) {
  await dbConnect();

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
      attendance, // <-- receive attendance from body
    } = body;

    if (
      !title ||
      !venue ||
      !description ||
      !type ||
      !startingDate ||
      !featuredImage ||
      !endingDate ||
      !allowedMembers
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Optional: Validate attendance
    if (
      attendance &&
      (!Array.isArray(attendance) ||
        !attendance.every((a) => typeof a === "number"))
    ) {
      return NextResponse.json(
        { error: "Attendance must be an array of numbers" },
        { status: 400 },
      );
    }

    const newEvent = new Event({
      title,
      venue,
      description,
      type,
      needAttendance: needAttendance ?? false,
      startingDate: new Date(startingDate),
      endingDate: new Date(endingDate),
      allowedMembers,
      featuredImage,
      allowedDepartments,
      allowedDesignations,
      notes: notes || "",
      attendance: attendance || [], // <-- set attendance if provided, otherwise empty
      prId: null, // initially no PR attached
    });

    const savedEvent = await newEvent.save();

    return NextResponse.json(savedEvent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const events = await Event.find().sort({ createdDate: -1 }); // Sort newest first
    return NextResponse.json(events, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
