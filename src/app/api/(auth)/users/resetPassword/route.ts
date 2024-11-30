import { hasAuth } from "@/helpers/hasAuth";
import { singleResetMail } from "@/helpers/mailer";
import UserAuth from "@/model/UserAuth";
import { compare, hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const { session, isPermitted } = await hasAuth();

    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({
        message: "Invalid or expired token. Please try again",
      });
    }

    const user = await UserAuth.findOne({ verifyToken: token });

    if (!user) {
      return NextResponse.json({
        message: "Invalid or expired token. Please try again",
      });
    }

    return NextResponse.json({
      message: "Valid Token. You can now reset your password",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const { session, isPermitted } = await hasAuth();

    const user = await UserAuth.findOne({ email: email });

    if (!user) {
      return NextResponse.json({
        message:
          "If this email is registered, a password reset link will be sent to your email",
      });
    }

    if (user.verifyToken) {
      await singleResetMail(user.name, user.email, user.verifyToken);
      return NextResponse.json({
        message:
          "If this email is registered, a password reset link will be sent to your email",
      });
    }

    const verifyToken = uuidv4();

    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 1);

    const member = await UserAuth.findOneAndUpdate(
      { email: email },
      { verifyToken: verifyToken, expiresIn: expiresIn },
      { new: true },
    );

    if (!member) {
      return NextResponse.json({
        message: "There was an error in sending the password reset link",
      });
    }

    await singleResetMail(member.name, member.email, verifyToken);

    return NextResponse.json({
      message:
        "If this email is registered, a password reset link will be sent to your email",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { newPassword, token } = body;

    console.log(newPassword);

    const { session, isPermitted } = await hasAuth();

    const user = await UserAuth.findOne({ verifyToken: token });

    if (!user) {
      return NextResponse.json({
        message: "Invalid or expired token. Please try again",
      });
    }

    const isTokenExpired = new Date() > new Date(user.expiresIn);

    console.log(isTokenExpired);

    if (isTokenExpired) {
      return NextResponse.json({
        message: "Token has expired. Please try again",
      });
    }

    const isSameCurrentPassword = await compare(newPassword, user.password);

    if (isSameCurrentPassword) {
      return NextResponse.json({
        message: "New password cannot be the same as the old password",
      });
    }

    const hashPass = await hash(newPassword, 10);

    const updatedUser = await UserAuth.findByIdAndUpdate(user._id, {
      password: hashPass,
      verifyToken: null,
      expiresIn: null,
    });

    if (!updatedUser) {
      return NextResponse.json({
        message: "Password reset failed. Please try again",
      });
    }
    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
