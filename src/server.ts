import express from "express";
import path from "path";
import { generateText } from "./gemini-pro";

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.post("/generate", async (req, res) => {
    try{
        const {prompt} = req.body;

        if(!prompt){
            return res.status(400).json({ error : "You did not enter a prompt."});
        }

        const output = await generateText(prompt);

        res.json({sucess: true, text: output});
    } catch(error){
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error });
    }
});

app.listen(3000, () => {
    console.log(`Express is running on 3000`);
});