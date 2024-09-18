const saltRounds = 10;
import generatePassword from "@/helpers/generatePassword";
import { singleWelcomeMail } from "@/helpers/mailer";
import dbConnect from "@/lib/dbConnect";

// import MemberEBAssessment from "@/model/MemberEBAssessment";
import MemberInfo from "@/model/MemberInfo";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import UserAuth from "@/model/UserAuth";
import { hash } from "bcrypt";
// import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, studentId, gSuiteEmail, buccDepartment, status } = body;
    const { departmentBracu, joinedBracu } = await PreregMemberInfo.findOne({
      studentId,
    }).exec();

    if (status !== "Accepted") {
      return NextResponse.json(
        { message: "User is not accepted" },
        { status: 400 },
      );
    }

    const user = await MemberInfo.findOne({ email: gSuiteEmail }).exec();
    const userAuth = await UserAuth.findOne({
      email: gSuiteEmail,
    }).exec();

    if (user || userAuth) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const password = generatePassword();
    const hashPass = await hash(password, saltRounds);

    const newUser = new UserAuth({
      name,
      email: gSuiteEmail,
      password: hashPass,
    });

    await newUser.save();

    const userID = await UserAuth.findOne({ email: gSuiteEmail }).exec();
    const newMember = new MemberInfo({
      _id: userID.id.toString(),
      name,
      email: gSuiteEmail,
      studentId,
      buccDepartment,
      departmentBracu,
      joinedBracu,
    });
    await newMember.save();

    const createdMember = await MemberInfo.findOne({
      _id: userID.id.toString(),
    }).exec();

    if (!createdMember) {
      return NextResponse.json(
        { message: "User not created" },
        { status: 400 },
      );
    }

    // const data = {
    //   name: createdMember.name,
    //   studentId: createdMember.studentId,
    //   email: createdMember.email,
    //   buccDepartment: createdMember.buccDepartment,
    //   designation: createdMember.designation,
    //   joinedBucc: createdMember.joinedBracu,
    //   lastPromotion: createdMember.lastPromotion || "Never Promoted",
    // };

    // const auth = new google.auth.GoogleAuth({
    //   credentials: {
    //     client_email: process.env.GOOGLE_CLIENT_EMAIL,
    //     private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    //   },
    //   scopes: [
    //     "https://www.googleapis.com/auth/drive",
    //     "https://www.googleapis.com/auth/drive.file",
    //     "https://www.googleapis.com/auth/spreadsheets",
    //   ],
    // });

    // const sheets = google.sheets({ version: "v4", auth });

    // const response = await sheets.spreadsheets.values.append({
    //   spreadsheetId: process.env.GOOGLE_SHEET_ID,
    //   range: "SelectedMembers!A1:E1",
    //   valueInputOption: "USER_ENTERED",
    //   requestBody: {
    //     values: [
    //       [
    //         data.name,
    //         data.studentId,
    //         data.email,
    //         data.buccDepartment,
    //         data.designation,
    //         data.joinedBucc,
    //         data.lastPromotion,
    //       ],
    //     ],
    //   },
    // });

    await singleWelcomeMail(userID.id.toString(), name, gSuiteEmail, password);

    // await PreregMemberInfo.findOneAndDelete({ studentId }).exec();
    // await MemberEBAssessment.findOneAndDelete({ studentId }).exec();

    return NextResponse.json(
      { message: "Register Successful" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
