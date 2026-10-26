import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PendingMember from "@/model/PendingMember";
import User from "@/model/User";
import { isSuperUser } from "@/lib/permissions";
import { encrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";
 
// Background Geolocation Resolver (runs non-blocking to prevent request latency)
async function logSpammerInfo(ip: string, userAgent: string, blockReason: string, detail: string = "") {
  try {
    // Check if loopback or private network IP to avoid making unnecessary external API calls
    const isLocal = 
      ip === "127.0.0.1" || 
      ip === "::1" || 
      ip.startsWith("192.168.") || 
      ip.startsWith("10.") || 
      ip.startsWith("172.") || // Covers 172.16.0.0/12
      ip === "::ffff:127.0.0.1";
 
    let location = "Local Loopback / Private Network";
 
    if (!isLocal) {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      
      location = data.status === "success"
        ? `${data.city}, ${data.regionName}, ${data.country} [ISP: ${data.isp || "N/A"}]`
        : `Unknown Location (${data.message || "IP Geo-Lookup Failed"})`;
    }
      
    console.warn(`[SPAM BLOCKED] Reason: ${blockReason} | IP: ${ip} | Location: ${location} | UA: ${userAgent} ${detail}`);
  } catch (error) {
    console.warn(`[SPAM BLOCKED] Reason: ${blockReason} | IP: ${ip} | Location: (Geo-lookup connection error) | UA: ${userAgent} ${detail}`);
  }
}
 
// Public submission endpoint
export async function POST(request: Request) {
  await dbConnect();
 
  try {
    // Extract Client IP address
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               request.headers.get("x-real-ip") || 
               "127.0.0.1";
 
    const userAgent = request.headers.get("user-agent") || "";
    const lowerUA = userAgent.toLowerCase();
    
    // 1. User-Agent Bot & Automated Script Filtering
    const isBot = 
      lowerUA.includes("python") || 
      lowerUA.includes("requests") || 
      lowerUA.includes("urllib") || 
      lowerUA.includes("curl") || 
      lowerUA.includes("wget") ||
      lowerUA.includes("postman") ||
      lowerUA.includes("http-client") ||
      lowerUA.includes("playwright") ||
      lowerUA.includes("selenium");
 
    if (isBot) {
      logSpammerInfo(ip, userAgent, "Bot User-Agent Block");
      // Tarpit Honeypot: Return a fake success response so the spam script halts without writing to DB
      return NextResponse.json({ message: "Registration request submitted successfully! Awaiting board approval." });
    }
 
    // 2. Custom Front-End Verification Header Check
    const regHeader = request.headers.get("x-bucc-registration");
    if (regHeader !== "PortalToken-2026") {
      logSpammerInfo(ip, userAgent, "Missing Custom Header Token");
      // Tarpit Honeypot: Return fake success
      return NextResponse.json({ message: "Registration request submitted successfully! Awaiting board approval." });
    }
 
    const body = await request.json();
    const {
      name,
      email,
      password,
      studentId,
      phoneNumber,
      memberStatus, // "Active" or "Alumni"
      buccDepartment,
      bracuDepartment,
      designation,
      joinedBucc,
      joinedBracu,
      academicWebsite, // Honeypot Field
    } = body;
 
    // 3. Honeypot Trap Check (Invisible field filled out by bot scraper)
    if (academicWebsite) {
      logSpammerInfo(ip, userAgent, "Honeypot Trap Triggered", `| Input: "${academicWebsite}"`);
      // Tarpit Honeypot: Return fake success
      return NextResponse.json({ message: "Registration request submitted successfully! Awaiting board approval." });
    }
 
 
    // Basic validations
    if (!name || !email || !password || !studentId || !phoneNumber || !memberStatus || !buccDepartment || !bracuDepartment || !designation) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
 
    // Email domain validation: Enforce G-Suite for Active members, allow personal email for Alumni
    if (memberStatus === "Active") {
      if (!email.match(/^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/)) {
        return NextResponse.json({ message: "Please use a valid BRACU G-Suite email address." }, { status: 400 });
      }
    } else {
      if (!email.match(/^\S+@\S+\.\S+$/)) {
        return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
      }
    }
 
    // Student ID format validation
    if (!studentId.match(/^(?:[0-9]{8}|[0-9]{10})$/)) {
      return NextResponse.json({ message: "Please enter a valid 8 or 10 digit Student ID." }, { status: 400 });
    }
 
    const normEmail = email.toLowerCase().trim();
    const normStudentId = studentId.trim();
 
    // Check if user already exists in active accounts
    const existingUser = await User.findOne({
      $or: [{ email: normEmail }, { studentId: normStudentId }]
    });
 
    if (existingUser) {
      return NextResponse.json({ message: "An account with this email or student ID already exists." }, { status: 400 });
    }
 
    // Check if already in pending requests
    const existingPending = await PendingMember.findOne({
      $or: [{ email: normEmail }, { studentId: normStudentId }]
    });
 
    if (existingPending) {
      return NextResponse.json({ message: "A registration request is already pending approval for this student." }, { status: 400 });
    }
 
    // Encrypt password securely
    const encryptedPassword = encrypt(password);
 
    // Create pending request
    const pendingRequest = new PendingMember({
      name: name.trim(),
      email: normEmail,
      password: encryptedPassword,
      studentId: normStudentId,
      phoneNumber: phoneNumber.trim(),
      memberStatus,
      buccDepartment,
      bracuDepartment,
      designation,
      joinedBucc: joinedBucc || "",
      joinedBracu: joinedBracu || "",
    });
 
    await pendingRequest.save();
 
    return NextResponse.json({ message: "Registration request submitted successfully! Awaiting board approval." });
  } catch (error: any) {
    console.error("Member registration submit error:", error);
    return NextResponse.json({ message: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
 
// Dashboard retrieval endpoint
export async function GET() {
  await dbConnect();
 
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
 
  const currentUser = session.user as any;
  const isSuper = isSuperUser(currentUser);
  const isAlumni = currentUser.memberStatus === "Alumni";
 
  // Alumni are never allowed to approve registration requests
  if (isAlumni) {
    return NextResponse.json({ message: "Alumni do not have permission to view pending registrations." }, { status: 403 });
  }
 
  const isDirectorOrAD = ["Director", "Assistant Director"].includes(currentUser.designation);
 
  // If not superadmin or department head, they are not authorized to view pending registrations
  if (!isSuper && !isDirectorOrAD) {
    return NextResponse.json({ message: "You do not have permission to view pending registrations." }, { status: 403 });
  }
 
  try {
    let requests = [];
 
    if (isSuper) {
      // Superadmins (Governing Body and R&D Admin) can see all pending requests
      requests = await PendingMember.find().sort({ createdAt: -1 });
    } else {
      // Department Director/AD can only see Current Member ("Active") requests for their own department
      requests = await PendingMember.find({
        memberStatus: "Active",
        buccDepartment: currentUser.buccDepartment
      }).sort({ createdAt: -1 });
    }
 
    // Do not return password field in the GET response
    const sanitizedRequests = requests.map((req: any) => {
      const obj = req.toObject();
      delete obj.password;
      return obj;
    });
 
    return NextResponse.json({ requests: sanitizedRequests });
  } catch (error: any) {
    console.error("Fetch pending members error:", error);
    return NextResponse.json({ message: "Failed to fetch pending registration requests" }, { status: 500 });
  }
}
