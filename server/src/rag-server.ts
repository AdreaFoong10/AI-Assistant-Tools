import { retrieveTopK } from "./rag/retrieval-vectorIndex-cosineSimilar";
import { genimiGenerateText } from "./services/gemini-pro";

export async function askRAG(apiKey: string, query: string) {
    const chunks = await retrieveTopK(query, 3);

    const context = chunks
  .map(c => c.text.trim())
  .join("\n\n---\n\n");

    console.log("Retrieved chunks for RAG:", chunks);
    console.log("Constructed context for RAG:", context);

    const prompt = `
You are a helpful assistant.

Use ONLY this context:

${context}

Question: ${query}
`;

    console.log("Final RAG prompt:", prompt);

    return await genimiGenerateText(apiKey, prompt);
}