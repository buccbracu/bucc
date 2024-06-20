import dbConnect from "@/lib/dbConnect";
import UserAuth from "@/model/UserAuth";
import { compare, hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {singleResetMail} from "@/helpers/mailer";
import exp from "constants";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(request: NextRequest,response: NextResponse) {
    try {

        await dbConnect();


        const token = request.nextUrl.searchParams.get('token');

        console.log(token);

        return NextResponse.json({
            message: "If this email is registered, a password reset link will be sent to your email",
        });
        
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
        
    }
}

export async function POST(request: NextRequest) {

try {
        const body = await request.json();
        const { email } = body;
        
        await dbConnect();

        const user = await UserAuth.findOne({ email: email })

        if (!user) {
            return NextResponse.json({
                message: "If this email is registered, a password reset link will be sent to your email",
            });
        }

        if(user.verifyToken){
            await singleResetMail(user.name, user.email, user.verifyToken);
            return NextResponse.json({
                message: "If this email is registered, a password reset link will be sent to your email",
            });
        }

        const verifyToken = uuidv4();

        const expiresIn = new Date();
        expiresIn.setHours(expiresIn.getHours() + 1);

        const member = await UserAuth.findOneAndUpdate(
            { email: email },
            { verifyToken: verifyToken, expiresIn: expiresIn },
            { new: true }
        );

        if (!member) {
            return NextResponse.json({
                message: "There was an error in sending the password reset link",
            });
        }

        await singleResetMail(member.name, member.email, verifyToken);

        return NextResponse.json({
            message: "If this email is registered, a password reset link will be sent to your email",
        });



} catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
}
}

