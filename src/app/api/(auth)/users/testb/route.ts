import { Queue } from "bullmq";
import { NextRequest, NextResponse } from "next/server";
import IORedis from "ioredis";

// Connect to your Redis instance
const redis = new IORedis({
  host: "immune-terrapin-21840.upstash.io",
  port: 6379,
  password: "AVVQAAIjcDFlNzgwODYxZjIzMGE0NzIxOWI4YjUzN2RmMGU1ZGY2NnAxMA",
  tls: {}, // Upstash requires TLS
});

// Queue reference
const emailQueue = new Queue("emailQueue", {
  connection: redis,
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.secret !== "mySuperSecret123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Clean completed jobs and remove all hashes
    await emailQueue.clean(0, Date.now(), "completed");
    await emailQueue.clean(0, Date.now(), "failed");
    await emailQueue.obliterate({ force: true });

    return NextResponse.json({
      message: "Queue and all related keys cleared ✅",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
