import { findRelevantContent } from "@/lib/ai/embedding";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText, tool } from "ai";
import { z } from "zod";
import { searchExecutiveBody } from "@/helpers/searchExecutiveBody";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    maxSteps: 3,
    model: google("gemini-2.0-flash", {
      useSearchGrounding: true,
    }),
    messages,
    system: `You are a cheerful, helpful chatbot that always answers based on up-to-date 2025 knowledge using the websearch tool do that please. 
Stay positive, respectful, and upbeat in every reply. 
and remeber that Computer Club R&D dept was created in 2024. Before that there was no R&D dept.
If 18+ such topics come up, kindly reply: 
"I'm here to keep things respectful and helpful 😊 Let’s keep our conversation positive and appropriate!" 
For all other questions, be energetic, kind, encouraging, and optimistic. 
When asked about current events (e.g., leaders, facts), always reflect 2025 data without explicitly mentioning the year unless users ask.`,
    tools: {
      searchExecutiveBody: tool({
        description:
          "Search for executive body members by full name, nickname, or partial name. don't show image",
        parameters: z.object({
          query: z
            .string()
            .describe(
              "Full name, nickname, or partial name to search for executive members",
            ),
        }),
        execute: async ({ query }) => {
          console.log("===========Calling searchExecutiveBodyTool============");
          const results = searchExecutiveBody(query);

          return results.map(
            (member: {
              fullName: any;
              nickName: any;
              department: any;
              designation: any;
              image: any;
              facebookURL: any;
              linkedinURL: any;
              gitHubURL: any;
            }) => ({
              fullName: member.fullName,
              nickName: member.nickName,
              department: member.department,
              designation: member.designation,
              image: member.image,
              facebookURL: member.facebookURL,
              linkedinURL: member.linkedinURL,
              gitHubURL: member.gitHubURL,
            }),
          );
        },
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          similarQuestions: z.array(z.string()).describe("keywords to search"),
        }),
        execute: async ({ similarQuestions }) => {
          console.log("===========Calling getInformation============");
          const results = await Promise.all(
            similarQuestions.map(
              async (question) => await findRelevantContent(question),
            ),
          );
          // Flatten the array of arrays and remove duplicates based on 'name'
          const uniqueResults = Array.from(
            new Map(results.flat().map((item) => [item?.name, item])).values(),
          );
          return uniqueResults;
        },
      }),
      understandQuery: tool({
        description: `understand the users query. use this tool on every prompt.`,
        parameters: z.object({
          query: z.string().describe("the users query"),
          toolsToCallInOrder: z
            .array(z.string())
            .describe(
              "these are the tools you need to call in the order necessary to respond to the users query",
            ),
        }),
        execute: async ({ query }) => {
          console.log("===========Calling understandQuery============");
          const { object } = await generateObject({
            model: openai("gpt-4o-mini"),
            system:
              "You are a query understanding assistant. Analyze the user query and generate similar questions.",
            schema: z.object({
              questions: z
                .array(z.string())
                .max(3)
                .describe("similar questions to the user's query. be concise."),
            }),
            prompt: `Analyze this query: "${query}". Provide the following:
                    3 similar questions that could help answer the user's query`,
          });
          return object.questions;
        },
      }),
    },
  });
  return result.toDataStreamResponse();
}
