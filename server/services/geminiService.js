import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '')
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean);

if (apiKeys.length === 0) {
    console.warn('No GEMINI_API_KEY / GEMINI_API_KEYS configured — README generation will fail.');
}

const clients = apiKeys.map((apiKey) => new GoogleGenAI({ apiKey }));
const systemPrompt = fs.readFileSync(path.join(__dirname, "ai_system_prompt.txt"), 'utf-8');

// Index of the key that last worked, so we keep using it until it gets rate-limited.
let preferredKey = 0;

// Retryable: per-key rate limits (429) and service overload (503).
const isRetryable = (error) => {
    const status = error?.status ?? error?.response?.status;
    return status === 429 || status === 503;
};

/**
 * Runs `run(client)` starting at `start`, moving to the next client whenever one
 * is rate-limited (429). Throws the last error once every key has failed.
 * Returns { result, index } of the client that succeeded.
 */
export async function runWithKeyFallback(clients, start, run) {
    if (clients.length === 0) {
        throw new Error('No Gemini API keys configured. Set GEMINI_API_KEY or GEMINI_API_KEYS.');
    }
    for (let i = 0; i < clients.length; i++) {
        const index = (start + i) % clients.length;
        try {
            return { result: await run(clients[index]), index };
        } catch (error) {
            if (!isRetryable(error) || i === clients.length - 1) throw error;
            console.warn(`Gemini key ${index + 1}/${clients.length} rate-limited or unavailable, trying next key…`);
        }
    }
}

async function callGemini(run) {
    const { result, index } = await runWithKeyFallback(clients, preferredKey, run);
    preferredKey = index;
    return result;
}

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

    const response = await callGemini((client) => client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: -1 },
        },
    }));

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
    const response = await callGemini((client) => client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: codeContext,
        config: {
            systemInstruction: systemPrompt,
            thinkingConfig: { thinkingBudget: -1 },
        },
    }));
    return response.text;
}

/**
 * Step 2 (streaming): Generate README and yield chunks as they arrive.
 * Returns an async generator yielding text strings.
 */
export async function* generateReadmeFromCodeStream(codeContext) {
    if (clients.length === 0) {
        throw new Error('No Gemini API keys configured. Set GEMINI_API_KEY or GEMINI_API_KEYS.');
    }
    for (let i = 0; i < clients.length; i++) {
        const index = (preferredKey + i) % clients.length;
        let emitted = false;
        try {
            const stream = await clients[index].models.generateContentStream({
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
                    emitted = true;
                    yield text;
                }
            }
            preferredKey = index;
            return;
        } catch (error) {
            // Once part of the README has been streamed, restarting would duplicate
            // output — surface the error instead of trying the next key.
            if (emitted || !isRetryable(error) || i === clients.length - 1) throw error;
            console.warn(`Gemini key ${index + 1}/${clients.length} rate-limited or unavailable, trying next key…`);
        }
    }
}

export default generateReadmeFromCode;
