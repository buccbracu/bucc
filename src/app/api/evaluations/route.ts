import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MemberEBAssesment from "@/model/MemberEBAssesment";
import { NextRequest, NextResponse } from "next/server";

const accessDesignation = [
  "PRESIDENT",
  "VICE PRESIDENT",
  "GENERAL SECRETARY",
  "TREASURER",
  "DIRECTOR",
  "ASSISTANT DIRECTOR",
];

export async function GET(request: NextRequest) {
  const session = await auth();
  const designation = session?.user?.designation;

  if (designation && !accessDesignation.includes(designation)) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const allMemberEBAssesment = await MemberEBAssesment.find();
    return NextResponse.json(allMemberEBAssesment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
