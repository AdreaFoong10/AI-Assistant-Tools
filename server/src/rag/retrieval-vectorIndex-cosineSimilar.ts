import { getEmbedding } from "./embedding";
import { Chunk } from "../types/chunk";

export const vectorStore: Chunk[] = [];

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        const ai = a[i] ?? 0;
        const bi = b[i] ?? 0;

        dot += ai * bi;
        magA += ai * ai;
        magB += bi * bi;
    }

    const denominator = Math.sqrt(magA) * Math.sqrt(magB);

    return denominator === 0 ? 0 : dot / denominator;
}

export async function retrieveTopK(
    query: string,
    topK = 3
): Promise<Chunk[]> {
    const MIN_THRESHOLD = 0.65;
    // 1. Embed the query
    const queryEmbedding = await getEmbedding(query);

    console.log("Query embedding:", queryEmbedding);

    // 2. Score all chunks
    const scored = vectorStore.map(chunk => {
        const score = cosineSimilarity(queryEmbedding, chunk.embedding);

        return {
            chunk,
            score
        };
    });

    console.log("Scored chunks:", scored);

    // 3. Sort by similarity (highest first)
    scored.sort((a, b) => b.score - a.score);

    const filtered = scored
    .sort((a, b) => b.score - a.score)
    .filter((s, i) => i < topK && s.score >= MIN_THRESHOLD);

    console.log("Filtered chunks:", filtered);

    // 4. Return top K
    return filtered.slice(0, topK).map(s => s.chunk);
}

export async function indexDocument(chunks: Chunk[]) {
    vectorStore.push(...chunks);
}