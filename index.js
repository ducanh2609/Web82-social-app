import express from "express";
import dotenv from 'dotenv';
import connectDatabase from "./database/index.js";
import RootRouter from "./routes/index.js";
import cors from "cors"
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors())
connectDatabase();

app.use('/api', RootRouter);
app.get('/', (req, res) => {
    res.send('Hello mindx-er!');
});

app.listen(PORT, () => {
    console.log('Server is running!');
});