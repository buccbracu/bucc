import { findRelevantContent, } from "@/lib/ai/embedding";
import { querySchedule } from "@/lib/ai/scheduleTool";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText, streamText, tool } from "ai";
import { z } from "zod";
import { searchExecutiveBody } from "@/helpers/searchExecutiveBody";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    maxSteps: 3,
    model: google("gemini-2.0-flash"),
    messages,
    system: `You are Nimbus, a cheerful and helpful AI assistant.  

- When asked about faculty, course, section, lab, or room schedules, first check if any classes or labs exist **for today**.  
  - If there are classes today, give the times and rooms.  
  - If there are none, reply clearly: "No classes or labs scheduled for today."  
- Use **getSchedule** tool automatically for schedule queries and Remeber TBA in faculty name means name not revealed.  
- Use **webSearch** tool automatically for current events or info not in internal knowledge.  
- Stay positive, respectful, concise, and accurate.  
- For inappropriate questions, reply politely: "I'm here to keep things respectful and helpful 😊".  
- Use internal knowledge for Computer Club and R&D Dept info (established 2024).
`,
    tools: {

      webSearch: tool({
        description: "Search the web for up-to-date info.",
        parameters: z.object({
          query: z.string().describe("The query to search the web for"),
        }),
        execute: async ({ query }) => {
          console.log("===========Calling webSearch tool============");

          const { text } = await generateText({
            model: google("gemini-2.0-flash", { useSearchGrounding: true }),
            prompt: `Search the web and summarize results for: ${query}`,
          });
          console.log("Web search results:", text);
          return text;
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
          console.log("Schedule query result:", result);
          return result.length ? result : "No matching schedule found.";
        },
      }),
      
    },
  });
  return result.toDataStreamResponse();
}
