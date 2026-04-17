"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const gemini_pro_1 = require("./gemini-pro");
const prompt_generation_1 = require("./prompt-generation");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.post("/generate", async (req, res) => {
    try {
        const { prompt, tool } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "You did not enter a prompt." });
        }
        const finalPrompt = (0, prompt_generation_1.buildPrompt)(tool, prompt);
        const output = await (0, gemini_pro_1.generateText)(finalPrompt);
        res.json({ sucess: true, text_input: finalPrompt, text_output: output });
    }
    catch (error) {
        console.log(error);
        const message = error?.message ||
            error?.response?.data?.error?.message ||
            JSON.stringify(error);
        if (message.includes("This model is currently experiencing high demand")) {
            return res.status(503).json({
                success: false,
                text_error: "The AI model is currently busy due to high traffic. Please try again in a few seconds."
            });
        }
        if (message.include("You exceeded your current quota, please check your plan and billing details.")) {
            return res.status(503).json({
                success: false,
                text_error: "You have exceeded your current quota. please check your plan and billing details."
            });
        }
        return res.status(500).json({
            success: false,
            text_error: "Gemini Error: Something went wrong. Please try again.",
            error: error
        });
    }
});
app.listen(3000, () => {
    console.log(`Express is running on 3000`);
});
//# sourceMappingURL=server.js.map