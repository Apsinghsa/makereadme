import express from 'express';
const router = express.Router();
import generateReadmeForRepo from '../controllers/readmeController.js';

router.get('/generate', async (req, res) => {
    try {
        const repoUrl = req.query.url;
        if (!repoUrl) {
            return res.status(400).send({ error: 'repoUrl query parameter is required' });
        }
        const readmeData = await generateReadmeForRepo(repoUrl);
        res.send(readmeData);
    } catch (error) {
        console.error('Error generating README:', error);
        res.status(500).send({ error: 'Failed to generate README' });
    }
});

export default router;