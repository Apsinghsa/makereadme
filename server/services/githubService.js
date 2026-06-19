import { Octokit } from "@octokit/rest";
import 'dotenv/config';
import { getRepoDetails } from "./github/url.js";
import { fetchAndProcessRepoFiles } from "./github/files.js";
import { askGeminiForRequiredFiles, generateReadmeFromCode, generateReadmeFromCodeStream } from "./geminiService.js";

/**
 * Tries fetching repo files using 'main', then falls back to 'master' if that fails.
 */
async function fetchWithBranchFallback(octokit, username, repo) {
    try {
        return await fetchAndProcessRepoFiles(octokit, username, repo, 'main');
    } catch (err) {
        console.warn(`Branch 'main' failed (${err.message}), trying 'master'…`);
        return await fetchAndProcessRepoFiles(octokit, username, repo, 'master');
    }
}

/**
 * Build the codeContext string used as Gemini's prompt body.
 * Prepends a sections directive when the caller specifies sections to include.
 */
function buildCodeContext(repoUrl, size, sections, fileTree, selectedFiles, fileContents) {
    let ctx = '';

    // Sections directive — must come first so the model sees it before code
    if (sections && sections.length > 0) {
        ctx += `Include ONLY the following sections in the README:\n${sections.join(', ')}\n\nIf a section does not apply to this repository, omit it entirely rather than adding filler content.\n\n`;
    }

    ctx += `Github repo url: ${repoUrl}\nREADME detail level: ${size}\n\nFile tree:\n`;
    fileTree.forEach(f => { ctx += f + '\n'; });

    if (selectedFiles && selectedFiles.length > 0) {
        ctx += '\n\nContent of selected files:\n';
        selectedFiles.forEach(filePath => {
            const content = fileContents[filePath];
            if (content !== undefined) {
                ctx += `### File: ${filePath}\n${content}\n\n`;
            }
        });
    } else {
        ctx += '\n\nContent of files:\n';
        Object.entries(fileContents).forEach(([filePath, content]) => {
            ctx += `### File: ${filePath}\n${content}\n\n`;
        });
    }

    return ctx;
}

export async function fetchAndProcessRepoContents(repoUrl) {
    const { username, repo } = getRepoDetails(repoUrl);

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    // 1. Fetch file tree + all content (branch fallback: main → master)
    let { fileTree, fileContents } = await fetchWithBranchFallback(octokit, username, repo);

    console.log(`Fetched ${fileTree.length} files from repo.`);

    // 2. Ask Gemini which files it actually needs
    let requiredFiles = await askGeminiForRequiredFiles(fileTree);
    let selectedFiles = null;

    if (requiredFiles && requiredFiles.length > 0) {
        const available = new Set(fileTree);
        selectedFiles = requiredFiles.filter(f => available.has(f));
        console.log(`Gemini requested ${requiredFiles.length} files, ${selectedFiles.length} available.`);
    } else {
        console.log("Falling back to sending all file contents.");
    }

    const codeContext = buildCodeContext(repoUrl, 'standard', [], fileTree, selectedFiles, fileContents);
    const generatedReadme = await generateReadmeFromCode(codeContext);
    return generatedReadme;
}

/**
 * Streaming version: yields README text chunks as Gemini produces them.
 */
export async function* fetchAndProcessRepoContentsStream(repoUrl, size = 'standard', sections = []) {
    const { username, repo } = getRepoDetails(repoUrl);

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    // 1. Fetch file tree + all content (branch fallback: main → master)
    let { fileTree, fileContents } = await fetchWithBranchFallback(octokit, username, repo);

    console.log(`Fetched ${fileTree.length} files from repo.`);

    // 2. Ask Gemini which files it actually needs
    let requiredFiles = await askGeminiForRequiredFiles(fileTree);
    let selectedFiles = null;

    if (requiredFiles && requiredFiles.length > 0) {
        const available = new Set(fileTree);
        selectedFiles = requiredFiles.filter(f => available.has(f));
        console.log(`Gemini requested ${requiredFiles.length} files, ${selectedFiles.length} available.`);
    } else {
        console.log("Falling back to sending all file contents.");
    }

    const codeContext = buildCodeContext(repoUrl, size, sections, fileTree, selectedFiles, fileContents);

    // 3. Stream the README generation
    for await (const chunk of generateReadmeFromCodeStream(codeContext)) {
        yield chunk;
    }
}

export default fetchAndProcessRepoContents;
