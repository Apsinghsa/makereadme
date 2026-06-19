import express from 'express';
const router = express.Router();
import fetchAndProcessRepoContents, { fetchAndProcessRepoContentsStream } from '../controllers/readmeController.js';

router.get('/generate', async (req, res) => {
    try {
        const repoUrl = req.query.url;
        const size = req.query.size || 'standard';
        if (!repoUrl) {
            return res.status(400).json({ error: 'url query parameter is required' });
        }
        // Validate GitHub URL
        if (!repoUrl.includes('github.com')) {
            return res.status(400).json({ error: 'Only GitHub repositories are supported' });
        }

        // Set streaming headers
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('X-Accel-Buffering', 'no');
        res.setHeader('Cache-Control', 'no-cache');
        res.flushHeaders();

        // Parse optional sections filter (comma-separated list)
        const rawSections = req.query.sections;
        const sections = rawSections
            ? rawSections.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        // Stream the README generation
        for await (const chunk of fetchAndProcessRepoContentsStream(repoUrl, size, sections)) {
            res.write(chunk);
        }
        res.end();
    } catch (error) {
        console.error('Error generating README:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Failed to generate README' });
        } else {
            res.end();
        }
    }
});

router.get('/health', (req, res) => res.json({ status: 'ok' }));

export default router;
