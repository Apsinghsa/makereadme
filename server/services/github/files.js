import AdmZip from "adm-zip";
import ignore from 'ignore';
import { trimZipRootDirectory } from '../pathUtils.js';

const IGNORE_PATTERNS = [
    // Dependency Directories
    'node_modules/', 'vendor/', 'venv/', '.venv/', 'env/', 'target/',

    // Build Output
    'dist/', 'build/', 'out/', '.next/', '.nuxt/',

    // Git & Version Control
    '.git/', '.gitignore', '.gitattributes',

    // Logs, Caches, System Files
    '*.log', '.DS_Store', 'Thumbs.db',

    // IDE/Editor Config
    '.vscode/', '.idea/',

    // Local Environment
    '.env', '.env.*',

    // Dependency Lock Files
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'composer.lock',

    // Binary Files & Media
    '*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.ico',
    '*.woff', '*.woff2', '*.ttf', '*.otf',
    '*.mp4', '*.mov', '*.mp3', '*.wav',
    '*.pdf', '*.doc', '*.docx',
];

export async function fetchAndProcessRepoFiles(octokit, owner, repo, ref) {
    let concatenatedCode  = "File tree : \n";
    const fileTree = [];
    let zipEntries;

    const ig = ignore().add(IGNORE_PATTERNS);

    try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
            owner: owner,
            repo: repo,
            ref: ref,   
        });

        const zipFileBuffer = Buffer.from(data);
        const zip = new AdmZip(zipFileBuffer);
        zipEntries = zip.getEntries();

    } catch (error) {
        console.error('Error fetching repository:', error);
        throw new Error('Failed to fetch repository from GitHub.');
    }

    if (!zipEntries){
        console.error("No zip entries to process");
        return { concatenatedCode: '', fileTree: [] };
    }

    zipEntries.forEach(entry => {
        if (!entry.isDirectory){
            try{
                fileTree.push(trimZipRootDirectory(entry.entryName));
            } catch(readError){
                console.log(`Can't get name of ${entry.entryName}`)
            }
        }
    })

    const filteredFileTree = ig.filter(fileTree);
    filteredFileTree.forEach(path => {concatenatedCode += path+'\n';})

    concatenatedCode += "\n\nContent of files : \n";

    zipEntries.forEach(entry => {
        if (!entry.isDirectory){
            try{
                const filePath = trimZipRootDirectory(entry.entryName)
                if (filteredFileTree.includes(filePath)){
                    const fileContent = entry.getData().toString('utf-8');
                    concatenatedCode += `### File: ${filePath} : \n ${fileContent}`
                }
            } catch(readError){
                console.log(`Can't read content from ${filePath}`)
            }
        }
    })

    return { concatenatedCode, fileTree: filteredFileTree };
}