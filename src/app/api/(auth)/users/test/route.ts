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
    
    if (body.secret !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, emailCount } = body;

    if (!email || !emailCount) {
      return NextResponse.json({ error: "Email or emailCount is missing" }, { status: 400 });
    }

    for (let i = 0; i < emailCount; i++) {
      const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: "Welcome to BUCC Portal",
        text: welcomeMail(
          "John Doe",
          "tashfeen.azmaine@g.bracu.ac.bd",
          "Iwonttellyoupass"
        ),
      };

      setTimeout(async () => {
        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email #${i + 1} sent to ${email}`);
        } catch (error) {
          console.error(`Failed to send email #${i + 1} to ${email}:`, error);
        }
      }, i * 1000);
    }

    return NextResponse.json(
      { message: "Emails are being sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
