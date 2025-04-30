import { welcomeMail } from "@/helpers/mailTemplates";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_SECRET,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: Infinity,
  rateLimit: 5,
});

const API_SECRET = "mySuperSecret123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Protection
    if (body.secret !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipientEmail = body.email;
    const emailCount = body.count;

    if (!recipientEmail || !emailCount) {
      return NextResponse.json(
        { error: "Please provide both 'email' and 'count' in body" },
        { status: 400 },
      );
    }

    // Send emails
    for (let i = 0; i < emailCount; i++) {
      const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: recipientEmail,
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
      { message: `Sent ${emailCount} emails to ${recipientEmail}` },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
