// src/client/insertToChatbot.ts

export async function insertToChatbot(content: string) {
  try {
    const response = await fetch("/api/bot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to insert data");
    }

    return await response.json();
  } catch (error) {
    console.error("Insert failed:", error);
    return null;
  }
}
