import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = ["Director", "Assistant Director"];
const permittedDepartments = ["Press Release and Publications"];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const event = await Event.findById(params.id).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to delete events" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    
    const deletedEvent = await Event.findByIdAndDelete(params.id).lean();

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event deleted successfully", event: deletedEvent },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to update events" },
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
    await dbConnect();
    
    // Remove the '_id' field from body if it exists to avoid conflicts
    const { _id, id, ...updateData } = body;
    
    // Convert date strings to Date objects if they exist
    const processedData: any = { ...updateData };
    if (processedData.startingDate) {
      processedData.startingDate = new Date(processedData.startingDate);
    }
    if (processedData.endingDate) {
      processedData.endingDate = new Date(processedData.endingDate);
    }
    
    processedData.lastUpdate = new Date();
    
    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      processedData,
      { new: true }
    ).lean();

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: any) {
    console.error("Error updating event:", error);
    return NextResponse.json({ 
      error: error.message,
      details: error.toString() 
    }, { status: 500 });
  }
}
