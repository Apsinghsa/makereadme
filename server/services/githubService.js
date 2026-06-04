import { Octokit } from "@octokit/rest";
import 'dotenv/config';
import { getRepoDetails } from "./github/url.js";
import { fetchAndProcessRepoFiles } from "./github/files.js";
import { askGeminiForRequiredFiles, generateReadmeFromCode, generateReadmeFromCodeStream } from "./geminiService.js";

export async function fetchAndProcessRepoContents(repoUrl) {
    const { username, repo } = getRepoDetails(repoUrl);

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    // 1. Fetch file tree + all content (we need both for fallback)
    let { fileTree, fileContents } = await fetchAndProcessRepoFiles(octokit, username, repo, 'main');

    console.log(`Fetched ${fileTree.length} files from repo.`);

    // 2. Ask Gemini which files it actually needs
    let requiredFiles = await askGeminiForRequiredFiles(fileTree);

    let codeContext;

    if (requiredFiles && requiredFiles.length > 0) {
        // Filter to only requested files that we actually have
        const available = new Set(fileTree);
        const filtered = requiredFiles.filter(f => available.has(f));
        console.log(`Gemini requested ${requiredFiles.length} files, ${filtered.length} available.`);

        // Build context from only those files
        codeContext = `Github repo url: ${repoUrl}\n\nFile tree:\n`;
        fileTree.forEach(f => { codeContext += f + '\n'; });
        codeContext += '\n\nContent of selected files:\n';
        filtered.forEach(filePath => {
            const content = fileContents[filePath];
            if (content !== undefined) {
                codeContext += `### File: ${filePath}\n${content}\n\n`;
            }
        });
    } else {
        // Fallback: send all file contents
        console.log("Falling back to sending all file contents.");
        codeContext = `Github repo url: ${repoUrl}\n\nFile tree:\n`;
        fileTree.forEach(f => { codeContext += f + '\n'; });
        codeContext += '\n\nContent of files:\n';
        Object.entries(fileContents).forEach(([filePath, content]) => {
            codeContext += `### File: ${filePath}\n${content}\n\n`;
        });
    }

    const generatedReadme = await generateReadmeFromCode(codeContext);
    return generatedReadme;
}

/**
 * Streaming version: yields README text chunks as Gemini produces them.
 */
export async function* fetchAndProcessRepoContentsStream(repoUrl, size = 'standard') {
    const { username, repo } = getRepoDetails(repoUrl);

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    // 1. Fetch file tree + all content (we need both for fallback)
    let { fileTree, fileContents } = await fetchAndProcessRepoFiles(octokit, username, repo, 'main');

    console.log(`Fetched ${fileTree.length} files from repo.`);

    // 2. Ask Gemini which files it actually needs
    let requiredFiles = await askGeminiForRequiredFiles(fileTree);

    let codeContext;

    if (requiredFiles && requiredFiles.length > 0) {
        const available = new Set(fileTree);
        const filtered = requiredFiles.filter(f => available.has(f));
        console.log(`Gemini requested ${requiredFiles.length} files, ${filtered.length} available.`);

        codeContext = `Github repo url: ${repoUrl}\nREADME detail level: ${size}\n\nFile tree:\n`;
        fileTree.forEach(f => { codeContext += f + '\n'; });
        codeContext += '\n\nContent of selected files:\n';
        filtered.forEach(filePath => {
            const content = fileContents[filePath];
            if (content !== undefined) {
                codeContext += `### File: ${filePath}\n${content}\n\n`;
            }
        });
    } else {
        console.log("Falling back to sending all file contents.");
        codeContext = `Github repo url: ${repoUrl}\nREADME detail level: ${size}\n\nFile tree:\n`;
        fileTree.forEach(f => { codeContext += f + '\n'; });
        codeContext += '\n\nContent of files:\n';
        Object.entries(fileContents).forEach(([filePath, content]) => {
            codeContext += `### File: ${filePath}\n${content}\n\n`;
        });
    }

    // Stream the README generation
    for await (const chunk of generateReadmeFromCodeStream(codeContext)) {
        yield chunk;
    }
}

export default fetchAndProcessRepoContents;
