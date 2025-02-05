import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { testConnection } from './database/database';
import anotaAiRoute from './routes/anotaAiRoute';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use('/api', anotaAiRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await testConnection();
});
