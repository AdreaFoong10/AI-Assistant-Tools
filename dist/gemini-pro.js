"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateText = generateText;
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
dotenv_1.default.config({ path: ".env.local" });
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("Missing API_KEY in .env.local");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
async function generateText(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
//# sourceMappingURL=gemini-pro.js.map