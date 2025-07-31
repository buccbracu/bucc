import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText, tool } from "ai";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import nodemailer from "nodemailer";

const fetchMembers = tool({
  description:
    "Fetch club members with flexible filtering. Returns member information including department and contact details.",
  parameters: z.object({
    contactNumber: z
      .string()
      .optional()
      .describe("Filter by contact number (partial match)"),
    buccDepartment: z
      .string()
      .optional()
      .describe(
        "Filter by BUCC club department (e.g., 'Governing Body', 'Research and Development')",
      ),
    departmentBracu: z
      .string()
      .optional()
      .describe(
        "Filter by BRACU academic department (e.g., 'Computer Science', 'CSE', 'CS')",
      ),
    designation: z.string().optional().describe("Filter by designation"),
    studentId: z.string().optional().describe("Filter by student ID"),
    memberStatus: z.string().optional().describe("Filter by member status"),
    name: z.string().optional().describe("Filter by name (partial match)"),
    email: z.string().optional().describe("Filter by email (partial match)"),
    bloodGroup: z
      .string()
      .optional()
      .describe("Filter by blood group (e.g., 'A+', 'O-')"),
    gender: z
      .string()
      .optional()
      .describe("Filter by gender (e.g., 'Male', 'Female')"),
    personalEmail: z
      .string()
      .optional()
      .describe("Filter by personal email (partial match)"),
    lastPromotion: z
      .string()
      .optional()
      .describe("Filter by last promotion date (YYYY-MM format)"),
    birthDate: z
      .string()
      .optional()
      .describe("Filter by birth date (YYYY-MM-DD format)"),
    returnFields: z
      .array(z.string())
      .optional()
      .describe(
        "Fields to return (default: ['name', 'email', 'buccDepartment', 'departmentBracu', 'contactNumber'])",
      ),
    limit: z
      .number()
      .optional()
      .describe("Max results (default: 50, max: 100)"),
  }),
  execute: async ({
    buccDepartment,
    designation,
    departmentBracu,
    studentId,
    memberStatus,
    name,
    email,
    bloodGroup,
    gender,
    personalEmail,
    lastPromotion,
    birthDate,
    contactNumber,
    returnFields = [
      "name",
      "email",
      "buccDepartment",
      "departmentBracu",
      "contactNumber",
    ],
    limit = 50,
  }) => {
    try {
      await dbConnect();
      const filter: any = {};
      if (contactNumber) filter.contactNumber = contactNumber;
      if (buccDepartment) filter.buccDepartment = buccDepartment;
      if (designation) filter.designation = designation;
      if (departmentBracu) filter.departmentBracu = departmentBracu;
      if (studentId) filter.studentId = studentId;
      if (memberStatus) filter.memberStatus = memberStatus;
      if (bloodGroup) filter.bloodGroup = bloodGroup;
      if (gender) filter.gender = gender;
      if (name) filter.name = { $regex: name, $options: "i" };
      if (email) filter.email = { $regex: email, $options: "i" };
      if (personalEmail)
        filter.personalEmail = { $regex: personalEmail, $options: "i" };
      if (birthDate) {
        if (birthDate.includes("-")) {
          if (birthDate.split("-").length === 3) {
            filter.birthDate = { $eq: new Date(birthDate) };
          } else if (birthDate.split("-").length === 2) {
            const [year, month] = birthDate.split("-");
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            filter.birthDate = { $gte: startDate, $lte: endDate };
          }
        } else if (!isNaN(parseInt(birthDate))) {
          const year = parseInt(birthDate);
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year + 1, 0, 0);
          filter.birthDate = { $gte: startDate, $lte: endDate };
        }
      }
      if (lastPromotion) {
        if (lastPromotion.includes("-")) {
          const [year, month] = lastPromotion.split("-");
          const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
          const endDate = new Date(parseInt(year), parseInt(month), 0);
          filter.lastPromotion = { $gte: startDate, $lte: endDate };
        } else if (!isNaN(parseInt(lastPromotion))) {
          const year = parseInt(lastPromotion);
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year + 1, 0, 0);
          filter.lastPromotion = { $gte: startDate, $lte: endDate };
        }
      }
      const projection: any = {};
      returnFields.forEach((field) => {
        projection[field] = 1;
      });
      const members = await MemberInfo.find(filter, projection).limit(
        Math.min(limit, 100),
      );
      if (members.length === 0) {
        return { count: 0, emailAddresses: [], summary: "No members found" };
      }
      const memberData = members.map((member: { [x: string]: any }) => {
        const result: any = {};
        returnFields.forEach((field) => {
          result[field] = member[field];
        });
        return result;
      });
      const emailAddresses = members.map((m: { email: any }) => m.email);
      return {
        count: members.length,
        members: memberData,
        emailAddresses: emailAddresses,
        summary: `Found ${members.length} members`,
      };
    } catch (error) {
      console.error("Error in fetchMembers:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

const sendEmailToList = tool({
  description:
    "Send personalized email to list of addresses with member details.",
  parameters: z.object({
    emailAddresses: z.array(z.string()).describe("Email addresses list"),
    subject: z.string().describe("Email subject"),
    message: z.string().describe("Email message"),
    memberDetails: z
      .array(
        z.object({
          name: z.string(),
          buccDepartment: z.string(),
          designation: z.string(),
        }),
      )
      .optional()
      .describe(
        "Member details for personalization (name, buccDepartment, designation)",
      ),
    confirmed: z.boolean().optional().describe("Confirm sending"),
  }),
  execute: async ({
    emailAddresses,
    subject,
    message,
    memberDetails,
    confirmed,
  }) => {
    try {
      if (!confirmed) {
        const recipientCount = emailAddresses.length;
        const preview = `Subject: ${subject}\nRecipients: ${recipientCount}\nMessage: ${message}`;
        if (memberDetails && memberDetails.length > 0) {
          return `Preview with Personalization:\n${preview}\n\nPersonalization will include name, BUCC department, and designation for each member.\n\nConfirm by replying "yes" or "confirm".`;
        }
        return `Preview:\n${preview}\n\nConfirm by replying "yes" or "confirm".`;
      }
      if (emailAddresses.length === 0) {
        return "No email addresses provided.";
      }
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_APP_SECRET,
        },
      });
      const results = [];
      for (let i = 0; i < emailAddresses.length; i++) {
        const email = emailAddresses[i];
        let personalizedMessage = message;
        if (memberDetails && memberDetails[i]) {
          const member = memberDetails[i];
          personalizedMessage = `
<p>Dear ${member.name},</p>
<p>${message}</p>
<p><strong>Department:</strong> ${member.buccDepartment}<br>
<strong>Designation:</strong> ${member.designation}</p>
<p>Best regards,<br>BRAC University Computer Club (BUCC)</p>
          `;
        } else {
          personalizedMessage = `
<p>Dear Club Member,</p>
<p>${message}</p>
<p>Best regards,<br>BRAC University Computer Club (BUCC)</p>
          `;
        }
        try {
          await transporter.sendMail({
            from: "nimbus+@bucc.com",
            to: email,
            subject: subject,
            html: personalizedMessage,
          });
          results.push({ email, status: "sent" });
        } catch (error) {
          results.push({
            email,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
      const sentCount = results.filter((r) => r.status === "sent").length;
      const failedCount = results.filter((r) => r.status === "failed").length;
      return `✅ Sent: ${sentCount}, Failed: ${failedCount}\nFailed: ${
        results
          .filter((r) => r.status === "failed")
          .map((r) => r.email)
          .join(", ") || "None"
      }`;
    } catch (error) {
      console.error("Error in sendEmailToList:", error);
      return `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
});

const previewEmailToList = tool({
  description:
    "Preview email to list of addresses with personalization options.",
  parameters: z.object({
    emailAddresses: z.array(z.string()).describe("Email addresses list"),
    subject: z.string().describe("Email subject"),
    message: z.string().describe("Email message"),
    memberDetails: z
      .array(
        z.object({
          name: z.string(),
          buccDepartment: z.string(),
          designation: z.string(),
        }),
      )
      .optional()
      .describe(
        "Member details for personalization (name, buccDepartment, designation)",
      ),
  }),
  execute: async ({ emailAddresses, subject, message, memberDetails }) => {
    if (emailAddresses.length === 0) {
      return "No email addresses provided.";
    }
    const recipientCount = emailAddresses.length;
    let preview = `📧 Preview:\n\nSubject: ${subject}\nRecipients: ${recipientCount}\nMessage: ${message}`;
    if (memberDetails && memberDetails.length > 0) {
      preview += `\n\nPersonalization will include:\n- Name: ${memberDetails[0]?.name || "N/A"}\n- BUCC Department: ${memberDetails[0]?.buccDepartment || "N/A"}\n- Designation: ${memberDetails[0]?.designation || "N/A"}`;
    }
    return `${preview}\n\nUse sendEmailToList with confirmed=true to send.`;
  },
});

const understandQuery = tool({
  description: "Analyze user query to determine intent and tools needed.",
  parameters: z.object({
    query: z.string().describe("User query"),
    toolsToCallInOrder: z.array(z.string()).describe("Tools to call in order"),
  }),
  execute: async ({ query }) => {
    console.log("===========Calling understandQuery============");
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      system: "Analyze query to understand intent.",
      schema: z.object({
        questions: z.array(z.string()).max(3).describe("Similar questions"),
      }),
      prompt: `Analyze: "${query}". Provide 3 similar questions.`,
    });
    return object.questions;
  },
});

const maxDuration = 30;

export async function POST(req: Request) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return new Response("Database connection failed", { status: 500 });
  }

  const { messages } = await req.json();
  const result = streamText({
    maxSteps: 5,
    model: google("gemini-2.0-flash"),
    messages,
    system: `You are Nimbus+, an AI assistant for BRAC University Computer Club.
Capabilities:
- Fetch member information with filters
- Send personalized emails
Process:
1. understandQuery → analyze request
2. fetchMembers → get member details (name, buccDepartment, designation)
3. previewEmailToList → preview email
4. sendEmailToList → send email (confirmed=true)
Important:
- Never say you can't send emails
- R&D dept created in 2024
- Avoid 18+ topics
Always include name, buccDepartment, and designation in emails.`,
    tools: {
      understandQuery,
      fetchMembers,
      previewEmailToList,
      sendEmailToList,
    },
  });

  return result.toDataStreamResponse();
}
