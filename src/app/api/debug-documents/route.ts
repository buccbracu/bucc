import { NextResponse } from "next/server";
import { documentStore } from "@/lib/documentStore";

export async function GET() {
  const docs = Array.from(documentStore.entries()).map(([id, doc]) => ({
    id,
    filename: doc.filename,
    mimeType: doc.mimeType,
    timestamp: doc.timestamp,
    bufferLength: doc.buffer.length,
    age: Date.now() - doc.timestamp,
  }));

  return NextResponse.json({
    documents: docs,
    count: docs.length,
    storeSize: documentStore.size,
  });
}
