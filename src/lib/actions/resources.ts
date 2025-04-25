"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schema/resources";
import { generateEmbeddings } from "../ai/embedding";
import { db } from "../db";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";


const generateRandomEmbedding = (): number[] => {
  return Array.from({ length: 1536 }, () => Math.random());
};

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    // const embeddings = await generateEmbeddings(content);
    const contents = [
      "I love biriyani.",
      "Biriyani is my favorite food.",
    ];
      const embeddings = contents.map((content) => ({
        resourceId: resource.id,
        content,
        embedding: generateRandomEmbedding(), // Generate a 1536-dimensional random embedding
      }));
      console.log(embeddings);
    await db.insert(embeddingsTable).values(embeddings);
    return "Resource successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};
