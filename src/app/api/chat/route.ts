import { findRelevantContent, } from "@/lib/ai/embedding";
import { querySchedule } from "@/lib/ai/scheduleTool";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import {generateText, streamText, tool } from "ai";
import { z } from "zod";
import { searchExecutiveBody } from "@/helpers/searchExecutiveBody";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    maxSteps: 3,
    model: google("gemini-2.0-flash"),
    messages,
    system: `
You are Nimbus, a cheerful and helpful AI assistant.  

Only use getSchedule tool when user will ask about schedule, class or section and if you asked about today's any faculty or section class first use getDateTime tool then getSchedule tool.  

and for other quries like any department use webSearch tool.  

If user ask about any person use webSearch tool to get the info and only give the info if he is related not both and don't show result for slighlty different name.  

- For inappropriate questions, reply politely: "I'm here to keep things respectful and helpful 😊".  
- For other questions, use webSearch tool to find accurate and relevant answers.  
`,
    tools: {
      webSearch: tool({
        description: "Search the web for up-to-date info",
        parameters: z.object({
          query: z.string().describe("The query to search the web for"),
        }),
        execute: async ({ query }) => {
          const { text } = await generateText({
            model: google("gemini-2.0-flash", { useSearchGrounding: true }),
            prompt: `Search the web and answer exactly what asked for and  you try to answer relevant to BRAC University and Computer Club relevant and if you can't find that answer what you received. ${query}`,
          });
          return text;
        },
      }),
      getDateTime: tool({
        description: "Get the current date and time.",
        parameters: z.object({}),
        async execute() {
          const now = new Date();
          return {
            date: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
            time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          };
        },
      }), 
      getSchedule: tool({
        description: "Get schedule info for faculty, course, section, lab, or room.",
        parameters: z.object({
          faculty: z.string().optional().describe("Faculty short name (e.g., MUNR) and TBA means Faculty name not revealed"),
          courseCode: z.string().optional().describe("Course code (e.g., CSE220)"),
          sectionName: z.string().optional().describe("Section name (e.g., 21)"),
          roomNumber: z.string().optional().describe("Room number (e.g., 09C-13C)"),
          type: z.enum(["class", "lab"]).optional().describe("Type of schedule"),
          day: z.string().optional().describe("Day of the week (e.g., Monday)"),

        }),
        async execute({ faculty, courseCode, sectionName, roomNumber, type }) {
          
          const result = await querySchedule({ faculty, courseCode, sectionName, roomNumber, type });
          return result.length ? result : "No matching schedule found.";
        },
      }),
      
    },
  });
  return result.toDataStreamResponse();
}
