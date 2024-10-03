import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Routes from './routes/video.js';
import dotenv from 'dotenv';  

dotenv.config();  

const app = express();


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('MongoDB connection error:', err));


app.use(cors());
app.use(express.json());


app.use('/videos', Routes);

const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
