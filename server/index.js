import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;
import cors from 'cors';
import router from './routes/api.js'


app.use(cors());

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// export default app;