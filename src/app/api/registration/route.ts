import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import EvaluationData from "@/model/EvaluationData";
import { NextRequest, NextResponse } from "next/server";
import generatePassword from "@/helpers/generatePassword";
import { singleWelcomeMail } from "@/helpers/mailer";
import { isGoverningBody as checkGB } from "@/lib/permissions";
import { db } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const isAlumni = 
      user?.memberStatus?.toLowerCase() === "alumni" || 
      user?.designation?.toLowerCase() === "alumni" ||
      user?.memberStatus !== "Active";

    if (isAlumni) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const isGB = checkGB(user);
    const isDeptHead = ["Director", "Assistant Director"].includes(user.designation);

    await dbConnect();

    // Fetch all accepted applicants
    const query: any = { status: "Accepted" };
    
    const config = await db.collection("appconfigs").findOne({ key: "recruitment_config" });
    const configVal = config?.value || { allowSERecruitmentAccess: false };
    const isSEAllowed = configVal.allowSERecruitmentAccess && user.designation === "Senior Executive";
 
    // STRICT VISIBILITY:
    // If GB: See everyone.
    // If Dept Head or permitted Senior Executive: ONLY see their own department.
    // Others: Forbidden.
    if (!isGB) {
      if (isDeptHead || isSEAllowed) {
        query.buccDepartment = user.buccDepartment;
      } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const acceptedApplicants = await EvaluationData.find(query).lean();

    // Filter out those who already have a user account in Better Auth
    const usersCollection = db.collection("user");
    const onboardedEmails = await usersCollection.find({}, { projection: { email: 1 } }).toArray();
    const onboardedEmailSet = new Set(onboardedEmails.map((u: any) => u.email.toLowerCase()));

    const pendingOnboarding = acceptedApplicants.filter(app => !onboardedEmailSet.has(app.email.toLowerCase()));

    return NextResponse.json(pendingOnboarding);
  } catch (error: any) {
    console.error("Error fetching pending applicants:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as any;
    const isAlumni = 
      currentUser?.memberStatus?.toLowerCase() === "alumni" || 
      currentUser?.designation?.toLowerCase() === "alumni" ||
      currentUser?.memberStatus !== "Active";

    if (isAlumni) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { 
      evaluationId, 
      name, 
      studentId, 
      email, 
      password,
      phoneNumber,
      bracuDepartment,
      buccDepartment
    } = body;

    await dbConnect();
    const applicant = await EvaluationData.findById(evaluationId);

    if (!applicant || applicant.status !== "Accepted") {
      return NextResponse.json({ error: "Applicant not found or not accepted" }, { status: 404 });
    }

    // Permission check
    const isGB = checkGB(currentUser);
    const isDeptHead = ["Director", "Assistant Director"].includes(currentUser.designation);
    
    const config = await db.collection("appconfigs").findOne({ key: "recruitment_config" });
    const configVal = config?.value || { allowSERecruitmentAccess: false };
    const isSEAllowed = configVal.allowSERecruitmentAccess && currentUser.designation === "Senior Executive";
 
    const hasRight = isGB || 
      ((isDeptHead || isSEAllowed) && currentUser.buccDepartment === applicant.buccDepartment);
 
    if (!hasRight) {
      return NextResponse.json({ error: "You are not authorized to onboard this member" }, { status: 403 });
    }

    const targetEmail = (email || applicant.email).toLowerCase();

    // Check if user already exists
    const usersCollection = db.collection("user");
    const existingUser = await usersCollection.findOne({ email: targetEmail });
    if (existingUser) {
      return NextResponse.json({ error: "Account already exists for this email" }, { status: 400 });
    }

    // Prepare final data
    const finalPassword = password || generatePassword();
    const finalName = name || applicant.name;
    const finalStudentId = studentId || applicant.studentId;
    const finalPhone = phoneNumber || applicant.phoneNumber;
    const finalBracuDept = bracuDepartment || applicant.bracuDepartment;
    const finalBuccDept = buccDepartment || applicant.buccDepartment;

    // Create user in Better Auth
    const newUser = await auth.api.signUpEmail({
      body: {
        email: targetEmail,
        password: finalPassword,
        name: finalName,
        studentId: finalStudentId,
        phoneNumber: finalPhone,
        bracuDepartment: finalBracuDept,
        buccDepartment: finalBuccDept,
        designation: "General Member",
        memberStatus: "Active",
        joinedBucc: applicant.responseObject?.joinedBucc || "", // Try to grab from response if exists
      },
    });

    if (!newUser) {
      throw new Error("Failed to create user account");
    }

    // Send Welcome Email with final credentials
    try {
      await singleWelcomeMail(newUser.user.id, finalName, targetEmail, finalPassword);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({ message: "Member onboarded successfully!", emailSent: true });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
