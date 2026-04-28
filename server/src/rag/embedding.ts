import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export async function getEmbedding(text: string): Promise<number[]> {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: {
                        parts: [{ text }]
                    }
                }),
            }
        );

        const data: any = await response.json();

        if (!response.ok) {
            console.error("Embedding API error:", data);
            throw new Error("Embedding API failed");
        }

        if (!data?.embedding?.values || !Array.isArray(data.embedding.values)) {
            throw new Error("Invalid embedding response");
        }

        return data.embedding.values;
    } catch (error) {
        console.error("Embedding failed:", error);
        throw error;
    }
}
