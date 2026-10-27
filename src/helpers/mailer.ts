import {
  resetMail,
  resetMailHtml,
  sendVerifyToken,
  welcomeMail,
} from "@/helpers/mailTemplates";
import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  pool: true,
  maxConnections: 3,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_SECRET,
  },
});

const singleWelcomeMail = async (
  userId: String,
  name: String,
  email: String,
  password: String,
) => {
  try {
    const sender = process.env.GMAIL_USERNAME;
    const mailOptions = {
      from: `"BRAC University Computer Club" <${sender}>`,
      to: email.toString().trim(),
      subject: "Welcome to BUCC Portal",
      text: welcomeMail(name, email, password),
    };
    await transporter.sendMail(mailOptions);

    return "Mail sent successfully";
  } catch (error: any) {
    console.error(`Failed to send welcome email to ${email}:`, error);
    throw new Error(error.message);
  }
};

const singleVerifyMail = async (
  name: string,
  email: string,
  verifyToken: string,
) => {
  try {
    const sender = process.env.GMAIL_USERNAME;
    const mailOptions = {
      from: `"BRAC University Computer Club" <${sender}>`,
      to: email.trim(),
      subject: "Verification Token",
      text: sendVerifyToken(name, verifyToken),
    };

    await transporter.sendMail(mailOptions);

    return "Mail sent successfully";
  } catch (error: any) {
    console.error(`Failed to send verify token to ${email}:`, error);
    return error.message;
  }
};

const singleResetMail = async (
  email: string,
  resetToken: string,
) => {
  try {
    const sender = process.env.GMAIL_USERNAME;
    const cleanEmail = email.trim().toLowerCase();
    const mailOptions = {
      from: `"BRAC University Computer Club" <${sender}>`,
      to: cleanEmail,
      subject: "Reset your BUCC Portal Password",
      text: resetMail(resetToken),
      html: resetMailHtml(resetToken),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${cleanEmail}: ${info.messageId}`);
    return "Mail sent successfully";
  } catch (error: any) {
    console.error(`Error sending password reset email to ${email}:`, error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

export { singleResetMail, singleVerifyMail, singleWelcomeMail };
