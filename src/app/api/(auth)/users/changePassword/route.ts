import { singleVerifyMail } from "@/helpers/mailer";
import dbConnect from "@/lib/dbConnect";
import UserAuth from "@/model/UserAuth";
import { compare, hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  await dbConnect();
  const user = {
    user: {
      name: "Tashfeen Azmaine",
      email: "tashfeen.azmaine@g.bracu.ac.bd",
      image: null,
      id: "667323824c238b4f56027c0b",
      designation: "GENERAL MEMBER",
      buccDepartment: "RESEARCH AND DEVELOPMENT",
    },
    expires: "2024-07-20T03:49:57.402Z",
  };
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to initiate Password Change",
    });
  }

  const member = await UserAuth.findOne({ _id: user.user.id });

  if (!member) {
    return NextResponse.json({
      message: "User not found",
    });
  }

  if (member.verifyToken) {
    await singleVerifyMail(user.user.name, user.user.email, member.verifyToken);

    return NextResponse.json({
      message: "Verification Token already sent",
    });
  }

  const verifyToken = uuidv4();
  const expiresIn = new Date();
  expiresIn.setHours(expiresIn.getHours() + 1);

  const membera = await UserAuth.findOneAndUpdate(
    { _id: user.user.id },
    { verifyToken: verifyToken, expiresIn: expiresIn },
    { new: true }
  );

  if (!member) {
    return NextResponse.json({
      message: "User not found",
    });
  }

  await singleVerifyMail(user.user.name, user.user.email, verifyToken);

  return NextResponse.json({ message: "Verification Mail Sent" });
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const user = {
      user: {
        name: "Tashfeen Azmaine",
        email: "tashfeen.azmaine@g.bracu.ac.bd",
        image: null,
        id: "667323824c238b4f56027c0b",
        designation: "GENERAL MEMBER",
        buccDepartment: "RESEARCH AND DEVELOPMENT",
      },
      expires: "2024-07-20T03:49:57.402Z",
    };

    if (!user) {
      return NextResponse.json({
        message: "You are not authorized to initiate Password Change",
      });
    }

    const { oldPassword, newPassword, verifyToken } = await request.json();

    const member = await UserAuth.findOne({ _id: user.user.id });

    if (member.expiresIn < new Date()) {
      return NextResponse.json({
        message: "Verification Token has expired",
      });
    }

    if (member.verifyToken !== verifyToken) {
      return NextResponse.json({
        message: "Verification Token is invalid",
      });
    }

    const isSameOldPassword = await compare(oldPassword, member.password);

    if (!isSameOldPassword) {
      return NextResponse.json({
        message: "Old Password is incorrect",
      });
    }

    const isSameNewPassword = await compare(newPassword, member.password);

    if (isSameNewPassword) {
      return NextResponse.json({
        message: "New Password cannot be the same as the old password",
      });
    }

    const hashPass = await hash(newPassword, 10);

    if (!member) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    await member.findOneAndUpdate(
      { _id: user.user.id },
      { password: hashPass, verifyToken: null, expiresIn: null },
      { new: true }
    );

    return NextResponse.json({ message: "Password Changed Successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
