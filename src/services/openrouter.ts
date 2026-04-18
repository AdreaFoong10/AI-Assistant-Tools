import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.OPENROUTER_API_KEY;

export async function openRouterGenerateText(prompt: string){
    const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'nvidia/nemotron-3-super-120b-a12b:free',
                messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            "reasoning": {"enabled": true}
        }),
    });

    const data = (await result.json()) as any;
    return data.choices?.[0]?.message?.content || "No response";
}
