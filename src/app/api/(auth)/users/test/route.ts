// app/api/sendEmails/route.ts (or any other route you want)
import { NextRequest, NextResponse } from "next/server";
import { Queue } from "bullmq";
import IORedis from "ioredis";

// Upstash Redis Connection (replace these details with your own)
const redis = new IORedis({
  host: "immune-terrapin-21840.upstash.io", // Redis hostname (Upstash)
  port: 6379, // Redis port (always 6379)
  password: "AVVQAAIjcDFlNzgwODYxZjIzMGE0NzIxOWI4YjUzN2RmMGU1ZGY2NnAxMA", // Your Redis password/token
  tls: {},
});

// Create the queue for emails
const emailQueue = new Queue("emailQueue", {
  connection: redis,
});

const API_SECRET = "mySuperSecret123";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.secret !== API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, emailCount } = body;

  if (!email || !emailCount) {
    return NextResponse.json(
      { error: "Email or emailCount is missing" },
      { status: 400 },
    );
  }

  // Add jobs to the queue
  for (let i = 0; i < emailCount; i++) {
    await emailQueue.add("sendEmail", {
      to: email,
      number: i + 1,
    });
  }

  return NextResponse.json(
    { message: `${emailCount} emails queued successfully ✅` },
    { status: 200 },
  );
}
