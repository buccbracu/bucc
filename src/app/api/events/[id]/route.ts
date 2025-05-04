import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import PR from "@/model/PR";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = ["Director", "Assistant Director"];
const permittedDepartments = ["Press Release and Publications"];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const { id } = params;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session || !isPermitted) {
    return NextResponse.json(
      { message: "You are not authorized to update this Event" },
      { status: 401 },
    );
  }

  let updateData;
  try {
    updateData = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or missing JSON body" },
      { status: 400 },
    );
  }

  try {
    await dbConnect();
    const { id } = params;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session || !isPermitted) {
    return NextResponse.json(
      { message: "You are not authorized to delete this Event" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = params;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete related PRs first
    await PR.deleteMany({ eventId: id });

    // Then delete the event
    await Event.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Event and related PRs deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
