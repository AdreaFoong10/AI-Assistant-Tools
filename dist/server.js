"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const gemini_pro_1 = require("./services/gemini-pro");
const prompt_generation_1 = require("./utils/prompt-generation");
const openrouter_1 = require("./services/openrouter");
const chat_history_1 = require("./services/chat-history");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.post("/generate", async (req, res) => {
    try {
        const { prompt, tool, provider, sessionId } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "You did not enter a prompt." });
        }
        const finalPrompt = (0, prompt_generation_1.buildPrompt)(tool, prompt);
        let output;
        console.log(provider);
        console.log(finalPrompt);
        if (provider === 'openrouter') {
            output = await (0, openrouter_1.openRouterGenerateText)(finalPrompt);
        }
        else if (provider === 'gemini') {
            output = await (0, gemini_pro_1.genimiGenerateText)(finalPrompt);
        }
        else {
            return res.status(400).json({
                success: false,
                text_error: "Invalid AI provider selected."
            });
        }
        console.log(output);
        (0, chat_history_1.addToHistory)(sessionId, prompt, output);
        res.json({ success: true, text_input: finalPrompt, text_output: output });
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
        return res.status(400).json({
            success: false,
            text_error: "Model Error: Something went wrong. Please try again."
        });
    }
});
app.get("/history/:sessionId", async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const history = (0, chat_history_1.getHistory)(sessionId);
        if (!sessionId || sessionId === "undefined") {
            return res.status(400).json({
                success: false,
                message: "Missing sessionId"
            });
        }
        if (!history || history.length === 0) {
            return res.status(400).json({ success: false, text_error: "You do not have any History." });
        }
        res.json({
            success: true,
            history: history
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            text_error: "Something went wrong while retrieving History : <br>" + error
        });
    }
});
app.delete("/history/:sessionId", (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        (0, chat_history_1.clearHistory)(sessionId);
        res.json({
            success: true,
            message: "History cleared"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to clear history"
        });
    }
});
app.listen(3000, () => {
    console.log(`Express is running on 3000`);
});
//# sourceMappingURL=server.js.map