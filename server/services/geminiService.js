import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const systemPrompt = fs.readFileSync(path.join(__dirname, "ai_system_prompt.txt"), 'utf-8');

async function generateReadmeFromCode(codeContext) {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: codeContext,
    config: {
        systemInstruction: `${systemPrompt}`,
        thinkingConfig: {
        thinkingBudget: -1, // Disables thinking
        }
        },
    });
    return response.text;
}

// async function reviewMD(reamemd) {
//     const reviewPrompt = fs.readFileSync(path.join(__dirname, "review_system_prompt.txt"), 'utf-8');
//     const response = await ai.models.generateContent({
//     model: "gemini-1.5-flash",
//     contents: codeContext,
//     config: {
//         systemInstruction: reviewPrompt,
//         // thinkingConfig: {
//         // thinkingBudget: -1, // Disables thinking
//         // }
//         },
//     });
//     return response.text;
// }


export default generateReadmeFromCode;


















































// import { GoogleGenerativeAI } from "@google/generative-ai";
// import 'dotenv/config';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Initialize AI client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Load the detailed system prompt for README generation
// const systemPromt = fs.readFileSync(path.join(__dirname, "ai_system_prompt.txt"), 'utf-8');

// /**
//  * Orchestrates a multi-turn conversation to generate a full README and a project slogan.
//  * @param {string} codeContext The concatenated code payload of the repository.
//  * @returns {Promise<{readme: string, slogan: string}>} The complete project data.
//  */
// async function generateReadmeAndSlogan(codeContext) {
//     try {
//         // --- Step 1: Start the chat and get the initial README ---

//         // The system prompt is set here once for the entire chat session.
//         const chat = genAI.getGenerativeModel({
//             model: "gemini-2.5-flash",
//             config: {
//                 thinkingConfig: {
//                 thinkingBudget: -1
//             }},
//             systemInstruction: {
//                 role: "model",
//                 parts: [{ text: systemPromt }],
//             },
//         }).startChat({
//             history: [],
//         });

//         // First message: Give the model the codebase and ask for the README.
//         console.log('Generating README...');
//         const readmeResult = await chat.sendMessage(`Here is the codebase for the project:\n\n${codeContext}`);
//         const readme = readmeResult.response.text();

//         // --- Step 2: Ask a follow-up question for a slogan ---

//         const sloganPrompt = "Generate a single, short(5-8 words), and catchy slogan or tagline for this project. Respond with only the slogan itself, without any additional text or formatting.";
        
//         console.log('Generating slogan...');
//         const sloganResult = await chat.sendMessage(sloganPrompt);
//         const slogan = sloganResult.response.text();
        
//         console.log('All data generated successfully.');
//         // return { readme, slogan };
//         return readme;
//     } catch (error) {
//         console.error('An error occurred during API communication:', error);
//         throw error;
//     }
// }

// export default generateReadmeAndSlogan;