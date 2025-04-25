import { createResource } from "@/lib/actions/resources";

export async function POST(req: Request) {
  const { content } = await req.json();

  try {
    const result = await createResource({ content });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return new Response("Failed to add resource", { status: 500 });
  }
}
