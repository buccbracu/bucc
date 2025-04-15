// src/client/insertToChatbot.ts

export async function insertToChatbot(inputText: string) {
  try {
    const res = await fetch("/api/chatbot/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: inputText }),
    });

    if (!res.ok) {
      throw new Error("Failed to insert chatbot data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Insert failed:", error);
    return null;
  }
}
