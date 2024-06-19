import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  const url = new URL(request.url);
  const MemberID = url.searchParams.get("id");

  const user = await auth();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }

  try {
    const users = await MemberInfo.findById(MemberID);

    if (!users) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    return NextResponse.json({ user: users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
