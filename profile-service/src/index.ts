import express from 'express';
import cookies from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from "./routes/profile.routes";
import {errorHandler} from "./middlewares/error.middleware";
import morgan from "morgan";
import connectToDB from "./database/database";
dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

app.use(morgan("dev"));
app.use(express.json());
app.use(cookies());

connectToDB();

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.use('/api', router);
app.use(errorHandler);




