import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import PR from "@/model/PR";
import Event from "@/model/Event";
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

    const pr = await PR.findById(id);
    if (!pr) {
      return NextResponse.json({ error: "PR not found" }, { status: 404 });
    }

    return NextResponse.json(pr, { status: 200 });
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
      { message: "You are not authorized to update this PR" },
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

    const pr = await PR.findById(id);
    if (!pr) {
      return NextResponse.json({ error: "PR not found" }, { status: 404 });
    }
    const updatedPR = await PR.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json(updatedPR, { status: 200 });
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
      { message: "You are not authorized to delete this PR" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = params;

    const pr = await PR.findById(id);
    if (!pr) {
      return NextResponse.json({ error: "PR not found" }, { status: 404 });
    }

    await PR.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "PR deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
