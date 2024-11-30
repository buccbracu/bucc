import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { NextResponse } from "next/server";

const permittedDepartments = ["Human Resources"];
const permittedDesignations = ["Director", "Assistant Director"];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session || !isPermitted) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }

  const { id } = params;

  try {
    const updatedData = await request.json();

    const updatedMember = await PreregMemberInfo.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true },
    );

    if (!updatedMember) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedMember, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating member", error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session || !isPermitted) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }

  await dbConnect();

  const { id } = params;

  try {
    const member = await PreregMemberInfo.findById(id);

    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(member, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching member", error: error.message },
      { status: 500 },
    );
  }
}
