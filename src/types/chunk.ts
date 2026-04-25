export type Chunk = {
    id: string;
    text: string;
    embedding: number[];
    metadata: {
        source: string;
        chunkIndex: number;
    };
};