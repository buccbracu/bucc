import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");

    const filter: any = {
      isPublicProfile: true,
      profileSlug: { $exists: true, $ne: "" },
    };

    if (department && department !== "All") {
      filter.buccDepartment = department;
    }

    const members = await User.find(filter)
      .select("name designation buccDepartment image profileSlug memberStatus joinedBucc bio currentJob")
      .lean();

    return NextResponse.json({
      users: members.map((m: any) => ({
        ...m,
        _id: m._id.toString(),
        id: m._id.toString(),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
