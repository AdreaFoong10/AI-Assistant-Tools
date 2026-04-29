export type RawChunk = {
    text: string;
    index: number;
};

export function chunkText(text: string, chunkSize = 800, overlap = 100): RawChunk[] {
    const sentences = text.split(/(?<=[.?!])\s+/); // split by sentences
    const chunks: RawChunk[] = [];

    let current = "";
    let index = 0;

    for (const sentence of sentences) {
        if ((current + sentence).length > chunkSize) {
            chunks.push({
                text: current.trim(),
                index
            });

            // overlap logic (keep last part)
            current = current.slice(-overlap) + sentence + " ";
            index++;
        } else {
            current += sentence + " ";
        }
    }

    if (current.trim().length > 0) {
        chunks.push({
            text: current.trim(),
            index
        });
    }

    return chunks;
}