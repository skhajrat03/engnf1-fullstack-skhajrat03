
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('TriageSync Backend is Running');
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
