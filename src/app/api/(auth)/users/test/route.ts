import { NextRequest, NextResponse } from "next/server";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const redis = new IORedis(process.env.UPSTASH_REDIS_URL!);

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
      { error: "Email or emailCount missing" },
      { status: 400 },
    );
  }

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
