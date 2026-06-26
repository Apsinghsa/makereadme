import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;
import cors from 'cors';
import router from './routes/api.js'


app.use(cors());

app.use('/api', router);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'makereadme-server',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// export default app;