import { auth } from "@/auth";
import { hasAuth } from "@/helpers/hasAuth";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextRequest, NextResponse } from "next/server";

const permittedFields = ["profileImage"];

export async function PATCH(request: NextRequest) {
  const { session, isPermitted } = await hasAuth();

  const userID = session?.user.id;

  if (!session || !isPermitted) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const allowedFields = permittedFields;

  const keys = Object.keys(body);
  const isValid = keys.every((key) => allowedFields.includes(key));

  if (!isValid) {
    return NextResponse.json({
      message: "Invalid Request. You are not authorized to update these fields",
    });
  }

  try {
    const user = await MemberInfo.findById(userID);

    if (!user) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    const oldPublicId = user.profileImage.split("/").pop()?.split(".")[0];

    const { profileImage } = body;

    await MemberInfo.findByIdAndUpdate(userID, {
      profileImage: profileImage,
    });

    console.log(oldPublicId);

    if (oldPublicId) {
      const cloudinaryResponse = await cloudinary.uploader.destroy(
        `${oldPublicId}`,
      );

      if (cloudinaryResponse.result === "not found") {
        return NextResponse.json(
          {
            message: "Profile Image not found",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({ message: "Profile Image Updated" });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();

  const session = await auth();
  const userID = session?.user.id;

  if (!session) {
    return NextResponse.json(
      {
        message: "You are not authorized to view this page",
      },
      { status: 401 },
    );
  }

  try {
    const user = await MemberInfo.findById(userID);

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const publicId = user.profileImage.split("/").pop()?.split(".")[0];

    const cloudinaryResponse = await cloudinary.uploader.destroy(`${publicId}`);

    if (cloudinaryResponse.result === "not found") {
      return NextResponse.json(
        {
          message: "Profile Image not found",
        },
        { status: 404 },
      );
    }

    await MemberInfo.findByIdAndUpdate(userID, {
      profileImage: "",
    });

    return NextResponse.json(
      { message: "Profile Image Deleted" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
