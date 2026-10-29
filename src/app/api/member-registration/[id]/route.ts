import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PendingMember from "@/model/PendingMember";
import User from "@/model/User";
import { isSuperUser } from "@/lib/permissions";
import { decrypt } from "@/lib/crypto";
import { auth as betterAuth } from "@/lib/auth";
import { singleWelcomeMail } from "@/helpers/mailer";
import { logActivity } from "@/helpers/activityLogger";
import { NextResponse } from "next/server";
 
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
 
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
 
  const currentUser = session.user as any;
  const isSuper = isSuperUser(currentUser);
  const isAlumni = currentUser.memberStatus === "Alumni";
 
  if (isAlumni) {
    return NextResponse.json({ message: "Alumni do not have permission to approve members." }, { status: 403 });
  }
 
  const resolvedParams = await params;
  const { id } = resolvedParams;
 
  try {
    const pending = await PendingMember.findById(id);
    if (!pending) {
      return NextResponse.json({ message: "Registration request not found" }, { status: 404 });
    }
 
    // Authorization Check:
    // - Superadmins can approve anyone.
    // - Department Directors/ADs can only approve Active Current Members of their own department.
    const isDirectorOrAD = ["Director", "Assistant Director"].includes(currentUser.designation);
    const isSameDept = currentUser.buccDepartment === pending.buccDepartment;
    const isPendingActive = pending.memberStatus === "Active";
 
    const canApprove = isSuper || (isDirectorOrAD && isSameDept && isPendingActive);
 
    if (!canApprove) {
      return NextResponse.json({ message: "You do not have permission to review or approve this member." }, { status: 403 });
    }
 
    const body = await request.json();
    const {
      action, // "approve" or "save"
      name,
      email,
      studentId,
      phoneNumber,
      buccDepartment,
      bracuDepartment,
      designation,
      memberStatus,
      joinedBucc,
      joinedBracu,
    } = body;
 
    if (!name || !email || !studentId || !phoneNumber || !buccDepartment || !bracuDepartment || !designation || !memberStatus) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
 
    // Domain validations: Enforce G-Suite for Active members, allow personal email for Alumni
    if (memberStatus === "Active") {
      if (!email.match(/^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/)) {
        return NextResponse.json({ message: "Please enter a valid BRACU G-Suite email address." }, { status: 400 });
      }
    } else {
      if (!email.match(/^\S+@\S+\.\S+$/)) {
        return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
      }
    }
 
    if (!studentId.match(/^(?:[0-9]{8}|[0-9]{10})$/)) {
      return NextResponse.json({ message: "Please enter a valid 8 or 10 digit Student ID." }, { status: 400 });
    }
 
    const normEmail = email.toLowerCase().trim();
    const normStudentId = studentId.trim();
 
    // Check unique constraints in User collection
    const existingUser = await User.findOne({
      $or: [{ email: normEmail }, { studentId: normStudentId }]
    });
    if (existingUser) {
      return NextResponse.json({ message: "An active member account already exists with this email or student ID." }, { status: 400 });
    }
 
    // Check unique constraints in other PendingMember requests
    const existingPending = await PendingMember.findOne({
      _id: { $ne: id },
      $or: [{ email: normEmail }, { studentId: normStudentId }]
    });
    if (existingPending) {
      return NextResponse.json({ message: "Another pending registration request is already using this email or student ID." }, { status: 400 });
    }
 
    // If the action is just to save the edits
    if (action === "save") {
      pending.name = name.trim();
      pending.email = normEmail;
      pending.studentId = normStudentId;
      pending.phoneNumber = phoneNumber.trim();
      pending.buccDepartment = buccDepartment;
      pending.bracuDepartment = bracuDepartment;
      pending.designation = designation;
      pending.memberStatus = memberStatus;
      pending.joinedBucc = joinedBucc || "";
      pending.joinedBracu = joinedBracu || "";
 
      await pending.save();
      return NextResponse.json({ message: "Registration request updated successfully." });
    }
 
    // If action is to approve
    if (action === "approve") {
      // Decrypt the original password securely
      const decryptedPassword = decrypt(pending.password);
 
      // Register user in Better Auth
      const signupRes = await betterAuth.api.signUpEmail({
        headers: new Headers(),
        body: {
          email: normEmail,
          password: decryptedPassword,
          name: name.trim(),
          studentId: normStudentId,
          phoneNumber: phoneNumber.trim(),
          buccDepartment,
          bracuDepartment,
          designation,
          memberStatus,
          joinedBucc: joinedBucc || "",
          joinedBracu: joinedBracu || "",
        }
      });
 
      // Send welcome/congrats email to user
      try {
        await singleWelcomeMail(
          signupRes.user?.id || "",
          name.trim(),
          normEmail,
          decryptedPassword
        );
      } catch (mailError) {
        console.error("Welcome email dispatch error:", mailError);
      }
 
      // Delete from pending requests upon successful signup creation
      await PendingMember.findByIdAndDelete(id);

      await logActivity({
        actor: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          designation: currentUser.designation,
          department: currentUser.buccDepartment,
        },
        method: "PATCH",
        category: "Members",
        action: "MEMBER_APPROVED",
        summary: `${currentUser.name} Approved ${name.trim()} Account Creation`,
        targetId: normStudentId,
        targetName: name.trim(),
        details: {
          newValue: {
            email: normEmail,
            buccDepartment,
            designation,
            memberStatus,
          },
        },
      });
 
      return NextResponse.json({ message: "Member registration approved and account created successfully!" });
    }
 
    return NextResponse.json({ message: "Invalid action parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("Patch registration request error:", error);
    return NextResponse.json({ message: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
 
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
 
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
 
  const currentUser = session.user as any;
  const isSuper = isSuperUser(currentUser);
  const isAlumni = currentUser.memberStatus === "Alumni";
 
  if (isAlumni) {
    return NextResponse.json({ message: "Alumni do not have permission to reject members." }, { status: 403 });
  }
 
  const resolvedParams = await params;
  const { id } = resolvedParams;
 
  try {
    const pending = await PendingMember.findById(id);
    if (!pending) {
      return NextResponse.json({ message: "Registration request not found" }, { status: 404 });
    }
 
    const isDirectorOrAD = ["Director", "Assistant Director"].includes(currentUser.designation);
    const isSameDept = currentUser.buccDepartment === pending.buccDepartment;
    const isPendingActive = pending.memberStatus === "Active";
 
    const canDelete = isSuper || (isDirectorOrAD && isSameDept && isPendingActive);
 
    if (!canDelete) {
      return NextResponse.json({ message: "You do not have permission to delete or reject this request." }, { status: 403 });
    }
 
    await logActivity({
      actor: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        designation: currentUser.designation,
        department: currentUser.buccDepartment,
      },
      method: "DELETE",
      category: "Members",
      action: "MEMBER_REJECTED",
      summary: `${currentUser.name} Rejected ${pending.name} Registration Request`,
      targetId: pending.studentId,
      targetName: pending.name,
      details: {
        oldValue: {
          email: pending.email,
          buccDepartment: pending.buccDepartment,
          designation: pending.designation,
        },
      },
    });

    await PendingMember.findByIdAndDelete(id);
    return NextResponse.json({ message: "Member registration request rejected and deleted." });
  } catch (error: any) {
    console.error("Delete registration request error:", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
