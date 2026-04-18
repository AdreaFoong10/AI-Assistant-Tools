import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Missing API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function genimiGenerateText(prompt: string){
    const model = genAI.getGenerativeModel({ model : "gemini-2.5-flash"});

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}