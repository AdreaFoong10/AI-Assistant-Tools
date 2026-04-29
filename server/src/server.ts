import express from "express";
import path from "path";
import { genimiGenerateText } from "./services/gemini-pro";
import { buildPrompt, combinePromptWithFile } from "./utils/prompt-generation";
import { openRouterGenerateText } from "./services/openrouter";
import { addToHistory, getHistory, clearHistory } from "./services/chat-history";
import multer from "multer";
import { extractTextFromFile } from "./services/file-retrieval";
import { askRAG } from "./rag-server";
import { processDocument } from "./rag/process-chunk-with-embedding";
import { indexDocument } from "./rag/retrieval-vectorIndex-cosineSimilar";
// import fs from "fs";

const upload = multer({ dest: "uploads/" });

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// ## OLD VERSION (NO FILE UPLOAD)
// app.post("/generate", async (req, res) => {
//     try{
//         const {prompt, tool, provider, sessionId} = req.body;

//         if(!prompt){
//             return res.status(400).json({ error : "You did not enter a prompt."});
//         }

//         const finalPrompt = buildPrompt(tool, prompt);

//         let output: string;
//         console.log(provider);
//         console.log(finalPrompt)

//         if(provider === 'openrouter'){
//             output = await openRouterGenerateText(finalPrompt);
//         } else if (provider === 'gemini'){
//             output = await genimiGenerateText(finalPrompt);
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 text_error: "Invalid AI provider selected."
//             });
//         }

//         console.log(output);
//         addToHistory(sessionId, prompt, output);

//         res.json({success: true, text_input: finalPrompt, text_output: output});
//     } catch(error: any){
//         console.log(error);
//         const message =
//             error?.message ||
//             error?.response?.data?.error?.message ||
//             JSON.stringify(error);

//         if (message.includes("This model is currently experiencing high demand")) {
//             return res.status(503).json({
//                 success: false,
//                 text_error: "The AI model is currently busy due to high traffic. Please try again in a few seconds."
//             });
//         } 

//         return res.status(400).json({
//             success: false,
//             text_error: "Model Error: Something went wrong. Please try again."
//         });
//     }
// });

app.post("/generate", upload.single("file"), async (req, res) => {
    try{
        console.log(req.body);
        let {prompt, tool, provider, sessionId} = req.body;
        const apiKey = req.headers["x-api-key"] as string;
        console.log("Received API Key in header: ", apiKey);

        if (!apiKey) {
            return res.status(400).json({ error: "Missing API key" });
        }

        let extractedText = "";
        let tempRAGPrompt = prompt;

        if(!prompt){
            return res.status(400).json({ error : "You did not enter a prompt."});
        }

        if (req.file) {
            extractedText = await extractTextFromFile(req.file);
            prompt = await combinePromptWithFile(prompt, extractedText);
        }

        // console.log("prompt : "+ prompt);

        const finalPrompt = buildPrompt(tool, prompt);

        let output: string;
        // console.log(provider);
        console.log("Tools selected : "+ tool);
        console.log("user Prompt Input: "+ tempRAGPrompt);
        console.log("Text extracted from text with addition prompt : "+ prompt);
        console.log("Final Prompt : "+ finalPrompt);

        if (tool === "rag") {
            if (!req.file) {
                return res.status(400).json({ error: "File required for RAG" });
            }
            output = `[RAG Retrieval Results for "${req.file.originalname}"]\n\nI've indexed your document and found the most relevant sections. Based on my analysis, here is the answer to your query: "${prompt.slice(0, 50)}...". \n\n(In a full implementation, this would use a vector database and embeddings).`;
            if (req.file) {
                const chunksWithEmbeddings = await processDocument(
                    extractedText,
                    req.file.filename
                );

                indexDocument(chunksWithEmbeddings);
            }
            
            output = await askRAG(apiKey, tempRAGPrompt);
        } else {
            if(provider === 'openrouter'){
                output = await openRouterGenerateText(apiKey, finalPrompt);
            } else if (provider === 'gemini'){
                output = await genimiGenerateText(apiKey, finalPrompt);
            } else {
                return res.status(400).json({
                    success: false,
                    text_error: "Invalid AI provider selected."
                });
            }
        }

        console.log(output);
        addToHistory(sessionId, prompt, output);

        // if (req.file) {
        //     fs.unlink(req.file.path, (err) => {
        //         if (err) console.error("File delete error:", err);
        //     });
        // }

        res.json({success: true, text_input: finalPrompt, text_output: output});
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

        return res.status(400).json({
            success: false,
            text_error: "Model Error: Something went wrong. Please try again."
        });
    }
});

app.get("/history/:sessionId", async (req, res) => {
    try{
        const sessionId = req.params.sessionId;

        const history = getHistory(sessionId);

        if (!sessionId || sessionId === "undefined") {
            return res.status(400).json({
                success: false,
                message: "Missing sessionId"
            });
        }

        if(!history || history.length === 0){
            return res.status(400).json({ success: false, text_error : "You do not have any History."});
        }

        res.json({
            success: true,
            history: history
        });
    } catch(error: any){
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

        clearHistory(sessionId);

        res.json({
            success: true,
            message: "History cleared"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to clear history"
        });
    }
});

app.listen(3000, () => {
    console.log(`Express is running on 3000`);
});