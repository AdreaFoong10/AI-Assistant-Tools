import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: ".env.local" });

export async function genimiGenerateText(apiKey: string, prompt: string){
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model : "gemini-2.5-flash"});

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}