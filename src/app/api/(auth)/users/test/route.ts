
import { welcomeMail } from "@/helpers/mailTemplates";
import nodemailer from "nodemailer";

// import MemberEBAssessment from "@/model/MemberEBAssessment";
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_SECRET,
  },
});
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    for (let i = 0; i < 160; i++) {
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: "tashfeen.azmaine@g.bracu.ac.bd",
      subject: "Welcome to BUCC Portal",
      text: welcomeMail(
        "John Doe",
        "tashfeen.azmaine@g.bracu.ac.bd",
        "Iwonttellyoupass",
      ),
    };
        await transporter.sendMail(mailOptions);
    }

    return NextResponse.json(
      { message: "Register Successful" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
