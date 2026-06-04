import AdmZip from "adm-zip";
import ignore from 'ignore';
import { trimZipRootDirectory } from '../pathUtils.js';

const IGNORE_PATTERNS = [
    'node_modules/', 'vendor/', 'venv/', '.venv/', 'env/', 'target/',
    'dist/', 'build/', 'out/', '.next/', '.nuxt/',
    '.git/', '.gitignore', '.gitattributes',
    '*.log', '.DS_Store', 'Thumbs.db',
    '.vscode/', '.idea/',
    '.env', '.env.*',
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'composer.lock',
    '*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.ico',
    '*.woff', '*.woff2', '*.ttf', '*.otf',
    '*.mp4', '*.mov', '*.mp3', '*.wav',
    '*.pdf', '*.doc', '*.docx',
];

/**
 * Fetches the zip, returns:
 * - fileTree: string[] of all filtered file paths
 * - fileContents: Record<string, string> map of path -> content
 */
export async function fetchAndProcessRepoFiles(octokit, owner, repo, ref) {
    const ig = ignore().add(IGNORE_PATTERNS);
    let zipEntries;

    try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
            owner, repo, ref,
        });
        const zip = new AdmZip(Buffer.from(data));
        zipEntries = zip.getEntries();
    } catch (error) {
        console.error('Error fetching repository:', error);
        throw new Error('Failed to fetch repository from GitHub.');
    }

    const rawFileTree = [];
    const entryMap = {};

    zipEntries.forEach(entry => {
        if (!entry.isDirectory) {
            try {
                const filePath = trimZipRootDirectory(entry.entryName);
                rawFileTree.push(filePath);
                entryMap[filePath] = entry;
            } catch (e) {
                console.log(`Can't get name of ${entry.entryName}`);
            }
        }
    });

    const fileTree = ig.filter(rawFileTree);
    const fileContents = {};

    fileTree.forEach(filePath => {
        try {
            fileContents[filePath] = entryMap[filePath].getData().toString('utf-8');
        } catch (e) {
            console.log(`Can't read content of ${filePath}`);
        }
    });

    return { fileTree, fileContents };
}
