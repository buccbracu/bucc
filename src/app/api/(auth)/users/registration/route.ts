import { hasAuth } from "@/helpers/hasAuth";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, name, semester, year, departmentBracu, email } = body;

    const { session, isPermitted } = await hasAuth();


    const member = await PreregMemberInfo.findOne({ email: email });

    if (member) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Convert the name to title case
    const nameArray = name.split(" ");
    const titleCaseName = nameArray
      .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");

    const newMember = new PreregMemberInfo({
      studentId,
      name: titleCaseName,
      joinedBracu: `${semester} ${year}`, // joinedBracu should be formatted like "Semester Year"
      departmentBracu,
      email,
    });

    await newMember.save();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Preregs!A1:E1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            studentId,
            titleCaseName,
            email,
            `${semester} ${year}`,
            departmentBracu,
          ],
        ],
      },
    });

    return NextResponse.json(
      { message: "Registration Successful" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
