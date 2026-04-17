import express from "express";
import path from "path";
import { generateText } from "./gemini-pro";
import { buildPrompt } from "./prompt-generation";

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.post("/generate", async (req, res) => {
    try{
        const {prompt, tool} = req.body;

        if(!prompt){
            return res.status(400).json({ error : "You did not enter a prompt."});
        }

        const finalPrompt = buildPrompt(tool, prompt);

        const output = await generateText(finalPrompt);

        res.json({sucess: true, text_input: finalPrompt, text_output: output});
    } catch(error: any){
        console.log(error);
        const message =
            error?.message ||
            error?.response?.data?.error?.message ||
            JSON.stringify(error);

        if (message.includes("This model is currently experiencing high demand")) {
            return res.status(503).json({
                success: false,
                text_error: "The AI model is currently busy due to high traffic. Please try again in a few seconds."
            });
        } 
        
        if (message.include("You exceeded your current quota, please check your plan and billing details.")){
            return res.status(503).json({
                success: false,
                text_error: "You have exceeded your current quota. Please check your plan and billing details."
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