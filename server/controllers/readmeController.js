import fetchAndProcessRepoContents, { fetchAndProcessRepoContentsStream } from "../services/githubService.js";

export default async function generateReadmeForRepo(repoUrl) {
    console.log("Starting README generation for:", repoUrl);
    const readmeContent = await fetchAndProcessRepoContents(repoUrl);
    console.log("Finished README generation.");
    return readmeContent;
}

export { fetchAndProcessRepoContentsStream };
