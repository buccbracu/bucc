import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import PR from "@/model/PR";
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
      { message: "You are not authorized to publish PRs" },
      { status: 401 },
    );
  }

  const user = session.user;

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
    const { title, description, content, eventId, featuredImage } = body;

    if (!title || !description || !content || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // If featuredImage is not provided, set it to null
    const newPR = new PR({
      title,
      description,
      content,
      eventId,
      featuredImage: featuredImage || null, // Default to null if not provided
      createdDate: new Date(),
      lastUpdate: new Date(),
    });

    const savedPR = await newPR.save();
    await Event.findByIdAndUpdate(body.eventId, {
      prId: newPR._id,
    });

    // (Optional) You could add notification logic here if needed for PRs
    // await sendTopicNotification({...})

    return NextResponse.json(savedPR, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const prs = await PR.find().sort({ createdDate: -1 }); // Sort newest first
    return NextResponse.json(prs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
