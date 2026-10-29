import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { isSuperUser } from "@/lib/permissions";
import { ObjectId } from "mongodb";
import { db } from "@/lib/auth";
import { logActivity } from "@/helpers/activityLogger";

const permittedDepartments = ["Human Resources", "Governing Body"];
const permittedDesignations = ["Director", "Assistant Director", "President", "Vice President", "General Secretary", "Treasurer"];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const memberID = url.searchParams.get("id");

  if (!memberID) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as any;
    const isAlumni = currentUser.memberStatus === "Alumni";
    const isGB = isSuperUser(currentUser);
    const isHR = currentUser.buccDepartment === "Human Resources" && !isAlumni;
    const isDeptHead = ["Director", "Assistant Director"].includes(currentUser.designation) && !isAlumni;

    if (!isGB && !(isHR && isDeptHead)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const usersCollection = db.collection("user");
    const user = await usersCollection.findOne({ _id: new ObjectId(memberID) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Fetch member error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const memberID = url.searchParams.get("id");

  if (!memberID) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as any;
    const isAlumni = currentUser.memberStatus === "Alumni";
    const isGB = isSuperUser(currentUser);
    const isHR = currentUser.buccDepartment === "Human Resources" && !isAlumni;
    const isDeptHead = ["Director", "Assistant Director"].includes(currentUser.designation) && !isAlumni;
    
    // Check if the current user is updating their own profile
    const isSelf = currentUser.id === memberID || currentUser._id?.toString() === memberID;

    if (!isGB && !(isHR && isDeptHead) && !isSelf) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const usersCollection = db.collection("user");

    // SANITIZE: Start with copy of body and remove internal MongoDB and verification fields
    const { _id, email, emailVerified, ...sanitizedBody } = body;
    let updateData = { ...sanitizedBody };

    // SANITIZE: Strip administrative fields if the user is a non-admin performing self-update
    if (!isGB && !(isHR && isDeptHead)) {
      delete updateData.name;
      delete updateData.studentId;
      delete updateData.buccDepartment;
      delete updateData.bracuDepartment;
      delete updateData.designation;
      delete updateData.memberStatus;
      delete updateData.joinedBracu;
      delete updateData.joinedBucc;
      delete updateData.lastPromotion;
    }

    // Profile Slug Validation
    let unsetOps: any = {};
    if (updateData.profileSlug !== undefined) {
      const slug = typeof updateData.profileSlug === "string" ? updateData.profileSlug.trim() : "";
      
      if (slug === "") {
        delete updateData.profileSlug;
        unsetOps.profileSlug = "";
      } else {
        const slugRegex = /^[a-zA-Z0-9-]+$/;
        if (!slugRegex.test(slug)) {
          return NextResponse.json({ error: "Slug must contain only alphanumeric characters and hyphens" }, { status: 400 });
        }

        const lowerSlug = slug.toLowerCase();

        // Reserved routes blacklisting
        const reservedSlugs = [
          "api", "dashboard", "login", "logout", "about", "events", "blogs", "projects", 
          "publications", "m", "registration", "evaluation", "faq", "history", "advisors", 
          "executive-body", "contact", "admin", "settings", "home", "profile", "portal", 
          "testimonials", "careers", "news", "gallery", "privacy", "terms"
        ];
        if (reservedSlugs.includes(lowerSlug)) {
          return NextResponse.json({ error: "This slug is reserved for portal routing" }, { status: 400 });
        }

        // Uniqueness check
        const existingUser = await usersCollection.findOne({
          profileSlug: lowerSlug,
          _id: { $ne: new ObjectId(memberID) }
        });

        if (existingUser) {
          return NextResponse.json({ error: "This profile slug is already in use by another member" }, { status: 400 });
        }

        updateData.profileSlug = lowerSlug;
      }
    }

    // Perform the update
    const updateOps: any = { $set: updateData };
    if (Object.keys(unsetOps).length > 0) {
      updateOps.$unset = unsetOps;
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(memberID) },
      updateOps,
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    logActivity({
      actor: {
        id: currentUser.id || currentUser._id?.toString(),
        name: currentUser.name || "Unknown",
        email: currentUser.email,
        designation: currentUser.designation,
        department: currentUser.buccDepartment,
      },
      action: "MEMBER_UPDATED",
      category: "Members",
      method: "PATCH",
      targetId: result.studentId || memberID,
      targetName: result.name,
      summary: `${currentUser.name || "An admin"} Updated Member Details for ${result.name} (${result.studentId || memberID})`,
      details: {
        newValue: updateData,
      },
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
    });

    return NextResponse.json({ user: result });
  } catch (error: any) {
    console.error("Update member error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const memberID = url.searchParams.get("id");

  if (!memberID) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as any;
    const isAlumni = currentUser.memberStatus === "Alumni";
    const isGB = isSuperUser(currentUser);
    const isHR = currentUser.buccDepartment === "Human Resources" && !isAlumni;
    const isDeptHead = ["Director", "Assistant Director"].includes(currentUser.designation) && !isAlumni;

    // Strict Deletion: Only GB or HR Department Heads can delete members
    if (!isGB && !(isHR && isDeptHead)) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to delete members" }, { status: 403 });
    }

    const usersCollection = db.collection("user");
    const targetUser = await usersCollection.findOne({ _id: new ObjectId(memberID) });

    const result = await usersCollection.deleteOne({ _id: new ObjectId(memberID) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    logActivity({
      actor: {
        id: currentUser.id || currentUser._id?.toString(),
        name: currentUser.name || "Unknown",
        email: currentUser.email,
        designation: currentUser.designation,
        department: currentUser.buccDepartment,
      },
      action: "MEMBER_DELETED",
      category: "Members",
      method: "DELETE",
      targetId: targetUser?.studentId || memberID,
      targetName: targetUser?.name,
      summary: `${currentUser.name || "An admin"} Deleted Member Profile of ${targetUser?.name || "Member"} (${targetUser?.studentId || memberID})`,
      details: {
        oldValue: targetUser ? {
          name: targetUser.name,
          studentId: targetUser.studentId,
          email: targetUser.email,
          buccDepartment: targetUser.buccDepartment,
          designation: targetUser.designation,
        } : undefined,
      },
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
    });

    return NextResponse.json({ message: "Member deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete member error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
