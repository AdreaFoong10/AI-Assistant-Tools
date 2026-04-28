import { chunkText } from "./chunk-spliting";
import { getEmbedding } from "./embedding";
import { Chunk } from "../types/chunk";

export async function processDocument(
    text: string,
    source: string
): Promise<Chunk[]> {

    const rawChunks = chunkText(text);

    const embeddings = await Promise.all(
        rawChunks.map(c => getEmbedding(c.text))
    );

    return rawChunks.map((chunk, i) => {
        const embedding = embeddings[i];

        if (!embedding) {
            throw new Error(`Missing embedding for chunk ${i}`);
        }

        return {
            id: `${source}-chunk-${i}`,
            text: chunk.text,
            embedding,
            metadata: {
                source,
                chunkIndex: i
            }
        };
    }).filter((x): x is Chunk => x !== null);
}