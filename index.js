import express from "express";
import dotenv from 'dotenv';
import connectDatabase from "./database/index.js";
import RootRouter from "./routes/index.js";
dotenv.config();

const POST = process.env.PORT || 8080;
const app = express();
app.use(express.json());

connectDatabase();

app.use('/api', RootRouter);
app.get('', (req, res) => {
    res.send('Hello mindx-er!');
});

app.listen(POST, () => {
    console.log('Server is running!');
});