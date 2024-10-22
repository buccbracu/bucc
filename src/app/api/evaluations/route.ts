import { auth } from "@/auth";
import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import MemberEBAssessment from "@/model/MemberEBAssessment";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

export async function GET(request: NextRequest) {

  try {

    const { session, isPermitted } = await hasAuth(permittedDesignations);

    if (!session || !isPermitted) {
      return NextResponse.json(
        { error: "You are not authorized to view this page" },
        { status: 401 },
      );
    }

    const allMemberEBAssessment = await MemberEBAssessment.find();
    return NextResponse.json(allMemberEBAssessment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
