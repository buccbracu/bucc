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
  maxConnections: 15,
  maxMessages: Infinity,
  rateLimit: 5,
});

const API_SECRET = "mySuperSecret123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.secret !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emails: string[] = body.emails;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "Please provide an 'emails' array in body" },
        { status: 400 },
      );
    }

    if (emails.length > 200) {
      return NextResponse.json(
        { error: "Max 200 emails allowed per request" },
        { status: 400 },
      );
    }

    const sendPromises = emails.map((email) => {
      const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: "Welcome to BUCC Portal",
        text: welcomeMail(
          "John Doe", 
          "tashfeen.azmaine@g.bracu.ac.bd",
          "Iwonttellyoupass",
        ),
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(sendPromises);

    return NextResponse.json(
      { message: `Sent ${emails.length} emails successfully` },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
