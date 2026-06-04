import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const systemPrompt = fs.readFileSync(path.join(__dirname, "ai_system_prompt.txt"), 'utf-8');

/**
 * Step 1: Ask Gemini which files it needs to generate a README.
 * Returns an array of file paths.
 */
export async function askGeminiForRequiredFiles(fileTree) {
    const prompt = `You are about to generate a README.md for a GitHub repository.
Here is the full list of files in the repository (after filtering out binaries, node_modules, etc.):

${fileTree.join('\n')}

Your task: Return ONLY a JSON array of file paths (strings) that you need to read in order to write a high-quality README.
Focus on: entry points, config files (package.json, pyproject.toml, Cargo.toml, etc.), main source files, existing README/docs, Dockerfile, CI configs, and any file whose name/path suggests it describes the project.
Do NOT include test files, lock files, or generated files.
Respond with ONLY the JSON array, no markdown fences, no explanation.
Example: ["package.json", "src/index.js", "README.md"]`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: -1 },
        },
    });

    const raw = response.text.trim();
    // Strip possible markdown fences
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    
    try {
        const files = JSON.parse(cleaned);
        if (!Array.isArray(files)) throw new Error("Not an array");
        return files;
    } catch (e) {
        console.error("Failed to parse file list from Gemini, sending all files:", e);
        return null; // caller will fall back to sending all files
    }
}

/**
 * Step 2: Generate README from selected file contents.
 */
export async function generateReadmeFromCode(codeContext) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: codeContext,
        config: {
            systemInstruction: systemPrompt,
            thinkingConfig: { thinkingBudget: -1 },
        },
    });
    return response.text;
}

/**
 * Step 2 (streaming): Generate README and yield chunks as they arrive.
 * Returns an async generator yielding text strings.
 */
export async function* generateReadmeFromCodeStream(codeContext) {
    const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: codeContext,
        config: {
            systemInstruction: systemPrompt,
            thinkingConfig: { thinkingBudget: -1 },
        },
    });
    for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
            yield text;
        }
    }
}

export default generateReadmeFromCode;
