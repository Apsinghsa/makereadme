import { Octokit } from "@octokit/rest";
import 'dotenv/config';
import { getRepoDetails } from "./github/url.js";
import { fetchAndProcessRepoFiles } from "./github/files.js";
import  generateReadmeFromCode  from "./geminiService.js";
import combine from "./combine.js";

export async function fetchAndProcessRepoContents(repoUrl) {
    const { username, repo } = getRepoDetails(repoUrl);

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    let { concatenatedCode, fileTree } = await fetchAndProcessRepoFiles(octokit, username, repo, 'main');

    // add repository url to codebase code
    concatenatedCode = `Github repo url : ${repoUrl}`+concatenatedCode+'\n';

    const generatedReadme = await generateReadmeFromCode(concatenatedCode);

//     const finalReadme = combine(repo, generatedReadmeAndSlogan);
//     return finalReadme;
    return generatedReadme
}

export default fetchAndProcessRepoContents;