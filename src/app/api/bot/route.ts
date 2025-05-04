import { hasAuth } from "@/helpers/hasAuth";
import { createResource } from "@/lib/actions/resources";
import { NextRequest, NextResponse } from "next/server";

const permittedDepartments = [
      "Governing Body",
      "Research and Development",
    ];
const permittedDesignations = [
      "President",
      "Vice President",
      "General Secretary",
      "Treasurer",
      "Director",
      "Assistant Director",
    ];

export async function POST(req: NextRequest) {
  
  const { content } = await req.json();

  try {
    const { session, isPermitted } = await hasAuth(
          permittedDesignations,
          permittedDepartments,
        );
    
        if (!session) {
          return NextResponse.json(
            { error: "You are not authorized to view this page" },
            { status: 401 },
          );
        }
    
        if (!isPermitted) {
          return NextResponse.json(
            {
              error: `${session?.user.designation}S of ${session?.user.buccDepartment} don't have the permission to view this page.`,
            },
            { status: 401 },
          );
        }
    const result = await createResource({ content });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return new Response("Failed to add resource", { status: 500 });
  }
}
