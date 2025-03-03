import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/model/Task";
import { NextResponse } from "next/server";

const permittedDesignations = [
  "director",
  "assistant director",
  "senior executive",
];

// GET: Fetch a single task by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth(permittedDesignations);

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to view this task" },
      { status: 401 },
    );
  }

  if (!isPermitted) {
    return NextResponse.json(
      { message: "You do not have sufficient permissions" },
      { status: 403 },
    );
  }

  try {
    await dbConnect();
    const task = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update a task by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth(permittedDesignations);

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to update this task" },
      { status: 401 },
    );
  }

  if (!isPermitted) {
    return NextResponse.json(
      { message: "You do not have sufficient permissions" },
      { status: 403 },
    );
  }

  try {
    await dbConnect();
    const updateData = await request.json();
    const updatedTask = await Task.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a task by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth(permittedDesignations);

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to delete this task" },
      { status: 401 },
    );
  }

  if (!isPermitted) {
    return NextResponse.json(
      { message: "You do not have sufficient permissions" },
      { status: 403 },
    );
  }

  try {
    await dbConnect();
    const deletedTask = await Task.findByIdAndDelete(params.id);
    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
