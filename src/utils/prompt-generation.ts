type Tool = "resume" | "email" | "blog" | "study";

export function buildPrompt(tool: string, input: string) {
    let BASE_PROMPT = `
    You are a text transformation engine, not an assistant.
    You ONLY transform input based on rules.
    Do NOT act like a chatbot.
    Do NOT give explanations unless asked.
    Return ONLY the output result.
    You are a deterministic text transformation engine.
    Never hallucinate new facts.
    Only reformat or rewrite input.
    `;

    switch (tool) {
        case "Q/A":
            return `
            You are a Question and Answer system.

            Answer the user's question clearly and accurately.
            Use simple language.
            Do not add unnecessary explanations.

            Question:
            ${input} 
            `

        case "resume":
            return `
${BASE_PROMPT}

Rewrite this into a professional resume bullet point: 
${input} 

Additional inputs:
Make it strong, concise, and recruiter-friendly.`;


        case "email":
            return `
${BASE_PROMPT}

Write a professional email based on this request:
${input}

Additional inputs:
Include subject line and formal tone.`;


        case "blog":
            return `
${BASE_PROMPT}

Generate 10 engaging blog titles about:
${input}

Additional inputs:
Make them catchy and SEO-friendly.`;


        case "study":
            return `
${BASE_PROMPT}

Explain this topic in simple study notes:
${input}

Additional inputs:
Use bullet points and clear structure.`;

        case "malaysian-gibberish":
            return `
${BASE_PROMPT}

Convert the input into Malaysian-style informal mixed slang conversation.

RULES:
- Use Manglish (Malay + English + Chinese slang if possible)
- Must sound casual like friends talking
- Can include slang like "lah", "meh", "bro", "weh", "sia"
- DO NOT correct or explain anything
- DO NOT act like an assistant
- ONLY output the transformed text

INPUT:
${input}

OUTPUT:
            `;

        default:
            return input;
    }
}

export function combinePromptWithFile(prompt: string, extractedText: string){
        return `
        You are a context-based AI system.

        You MUST use the provided context as the primary source of truth.
        If the answer exists in the context, do NOT guess or hallucinate.

        If the context does not contain the answer, say you don't know.
        ${extractedText}

        User Request:
        ${prompt}
        `;
}