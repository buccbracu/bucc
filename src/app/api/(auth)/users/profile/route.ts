import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextResponse } from "next/server";

//This endpoint is view only for only individual members

export async function GET() {
    await dbConnect();
    const user = await auth();

    console.log(user)

    if (!user) {
        return NextResponse.json({
          message: "You are not authorized to view this page",
        });
      }

      try {
        const users = await MemberInfo.findOne({ _id: user.user.id }).lean;
        return NextResponse.json({ user: users });
      } catch (error) {
        return NextResponse.json({ error: error });
      }

}