"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const gemini_pro_1 = require("./gemini-pro");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.post("/generate", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "You did not enter a prompt." });
        }
        const output = await (0, gemini_pro_1.generateText)(prompt);
        res.json({ sucess: true, text: output });
    }
    catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error });
    }
});
app.listen(3000, () => {
    console.log(`Express is running on 3000`);
});
//# sourceMappingURL=server.js.map