import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import anotaAiRoute from './routes/anotaAiRoute';
import { testConnection } from './database/database';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use('/api/anotaai', anotaAiRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await testConnection();
});
