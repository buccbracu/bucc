import dbConnect from "@/lib/dbConnect";
import PR from "@/model/PR";
import Event from "@/model/Event";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const searchQuery = request.nextUrl.searchParams.get("query");

    if (searchQuery) {
      const events = await Event.find({
        title: { $regex: searchQuery, $options: "i" },
      })
        .select("__id title startingDate prId")
        .limit(10);

      return NextResponse.json(events, { status: 200 });
    } else {
      const { id } = params;

      const pr = await PR.findById(id);
      if (!pr) {
        return NextResponse.json({ error: "PR not found" }, { status: 404 });
      }

      return NextResponse.json(pr, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
