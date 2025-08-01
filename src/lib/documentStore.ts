import { v4 as uuidv4 } from "uuid";

export interface DocumentData {
  buffer: Buffer;
  mimeType: string;
  filename: string;
  timestamp: number;
}

export const documentStore = new Map<string, DocumentData>();

// Cleanup documents older than 1 hour
if (typeof window === "undefined") {
  // Store the interval ID so we can clear it if needed
  let cleanupInterval: NodeJS.Timeout;

  // Function to clean up old documents
  const cleanupDocuments = () => {
    const now = Date.now();
    const oneHourAgo = now - 3600000; // 1 hour in milliseconds

    let deletedCount = 0;
    for (const [id, doc] of Array.from(documentStore.entries())) {
      if (doc.timestamp < oneHourAgo) {
        documentStore.delete(id);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} expired documents`);
    }

    // Log current store size
    console.log(`Document store contains ${documentStore.size} documents`);
  };

  // Run cleanup every 15 minutes (more frequent than the expiration time)
  cleanupInterval = setInterval(cleanupDocuments, 900000); // 15 minutes in milliseconds

  // Clean up on server shutdown
  process.on("SIGTERM", () => {
    clearInterval(cleanupInterval);
  });

  // Also run cleanup immediately on startup
  cleanupDocuments();
}
