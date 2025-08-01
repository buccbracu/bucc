import { NextRequest, NextResponse } from "next/server";
import { documentStore } from "@/lib/documentStore";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const format = searchParams.get("format");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const doc = documentStore.get(id);
    if (!doc) {
      console.log(`Document not found for ID: ${id}`);
      console.log(
        `Available document IDs: ${Array.from(documentStore.keys()).join(", ")}`,
      );
      return NextResponse.json(
        { error: "Document not found or expired" },
        { status: 404 },
      );
    }

    // Adjust content type based on format parameter
    let contentType = doc.mimeType;
    if (format === "pdf") {
      contentType = "application/pdf";
    } else if (format === "docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    return new NextResponse(new Uint8Array(doc.buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${doc.filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download document" },
      { status: 500 },
    );
  }
}
