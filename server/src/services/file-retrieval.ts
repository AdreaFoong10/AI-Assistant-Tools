import fs from "fs";
import mammoth from "mammoth";
const { PDFParse } = require('pdf-parse');

export async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
    const path = file.path;

    // txt
    if (file.mimetype === "text/plain") {
        return fs.readFileSync(path, "utf-8");
    }

    // pdf
    if (file.mimetype === "application/pdf") {
        const parser = new PDFParse({ url: path });
        const data = await parser.getText();
        await parser.destroy();
        return data.text;
    }

    // docx
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth.extractRawText({ path });
        return result.value;
    }

    return "Unsupported file type.";
}