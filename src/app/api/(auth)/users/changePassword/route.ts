
import dbConnect from "@/lib/dbConnect";
import UserAuth from "@/model/UserAuth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { hash, compare } from "bcrypt";
import { v4 as uuidv4} from "uuid"
import {singleVerifyMail} from "@/helpers/mailer"
import { use } from "react";

export async function GET(request: NextRequest) {

    await dbConnect();
    const user = {"user":{"name":"Tashfeen Azmaine","email":"tashfeen.azmaine@g.bracu.ac.bd","image":null,"id":"667323824c238b4f56027c0b","designation":"GENERAL MEMBER","buccDepartment":"RESEARCH AND DEVELOPMENT"},"expires":"2024-07-20T03:49:57.402Z"}
    if (!user) {
        return NextResponse.json({
            message: "You are not authorized to initiate Password Change",
        });
    }

    const verifyToken = uuidv4();
    const expiresIn = new Date()
    expiresIn.setHours(expiresIn.getHours() + 1);


    const member = await UserAuth.findOneAndUpdate(
        { _id: user.user.id }, 
        { verifyToken: verifyToken, expiresIn: expiresIn}, 
        { new: true }
    );

    if (!member) {
        return NextResponse.json({
            message: "User not found",
        });
    }

    await singleVerifyMail(user.user.name,user.user.email,verifyToken)




    return NextResponse.json({ message: "Verification Mail Sent"});

}

export async function POST(request: NextRequest) {
    await dbConnect();
    const user = {"user":{"name":"Tashfeen Azmaine","email":"tashfeen.azmaine@g.bracu.ac.bd","image":null,"id":"667323824c238b4f56027c0b","designation":"GENERAL MEMBER","buccDepartment":"RESEARCH AND DEVELOPMENT"},"expires":"2024-07-20T03:49:57.402Z"}

    if (!user) {
        return NextResponse.json({
            message: "You are not authorized to initiate Password Change",
        });
    }

    const { oldPassword, newPassword } = await request.json();



    const member = await UserAuth.findOne({ _id: user.user.id })

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

    //SEND A VERIFICATION MAIL HERE
    //FIGURE OUT HOW TO PROCEED WITH THE VERIFICATION TOKEN

    if (!member) {
        return NextResponse.json({
            message: "User not found",
        });
    }



    return NextResponse.json({ user: member });
}