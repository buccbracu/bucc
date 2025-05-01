// app/api/processEmails/route.ts (or any other route you want for processing)
import { NextRequest, NextResponse } from "next/server";
import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import IORedis from "ioredis";

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME, // replace with your Gmail username
    pass: process.env.GMAIL_APP_SECRET, // replace with your Gmail app secret (password)
  },
  pool: true,
  maxConnections: 5,
  maxMessages: Infinity,
  rateLimit: 5,
});

// Redis connection (same as above)
const redis = new IORedis({
  host: "immune-terrapin-21840.upstash.io",
  port: 6379,
  password: "AVVQAAIjcDFlNzgwODYxZjIzMGE0NzIxOWI4YjUzN2RmMGU1ZGY2NnAxMA",
  tls: {},
  maxRetriesPerRequest: null,
});

// Create a BullMQ Worker
const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, number } = job.data;

    // Mail options
    const mailOptions = {
      from: process.env.GMAIL_USERNAME, // same as transporter user
      to: to,
      subject: `Welcome Email #${number}`,
      text: `Hello! This is your welcome email #${number}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Sent email #${number} to ${to}`);
  },
  {
    connection: redis, // Redis connection
  },
);

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id ?? 'unknown'} failed:`, err);
});

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "Worker is running and processing jobs" },
    { status: 200 },
  );
}
