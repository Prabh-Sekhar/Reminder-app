import express from 'express';
import dotenv from 'dotenv';
import reminderRoutes from './routes/reminderRoutes'
import nodeCron from 'node-cron';
import './cronjobs/reminder'

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api', reminderRoutes);

app.get('/health', (req, res) => {
    res.send('All OK');
});

nodeCron.schedule("*/5 * * * * *", async () => {
    
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})