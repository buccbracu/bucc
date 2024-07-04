import {
  resetMail,
  sendVerifyToken,
  welcomeMail,
} from "@/helpers/mailTemplates";
import UserAuth from "@/model/UserAuth";
import "dotenv/config";
import nodemailer from "nodemailer";

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

const singleWelcomeMail = async (
  userId: String,
  name: String,
  email: String,
  password: String,
) => {
  try {
    const user = await UserAuth.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email.toString(),
      subject: "Welcome to BUCC Portal",
      text: welcomeMail(name, email, password),
    };
    await transporter.sendMail(mailOptions);

    return "Mail sent successfully";
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const singleVerifyMail = async (
  name: string,
  email: string,
  verifyToken: string,
) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Verification Token",
      text: sendVerifyToken(name, verifyToken),
    };

    await transporter.sendMail(mailOptions);

    return "Mail sent successfully";
  } catch (error: any) {
    return error.message;
  }
};

const singleResetMail = async (
  name: string,
  email: string,
  resetToken: string,
) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Reset your BUCC Portal Password",
      text: resetMail(name, resetToken),
    };

    await transporter.sendMail(mailOptions);

    return "Mail sent successfully";
  } catch (error: any) {
    return error.message;
  }
};

export { singleResetMail, singleVerifyMail, singleWelcomeMail };
