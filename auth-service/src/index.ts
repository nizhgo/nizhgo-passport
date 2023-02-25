import cookies from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import {errorHandler} from "./middlewares/error.middleware";
import {logsMiddleware} from "./middlewares/logs.middleware";
import router from "./routes/auth.routes";
dotenv.config();
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(logsMiddleware);
app.use(express.json());
app.use(cookies());
app.use(cors());
app.use(errorHandler);

//routes
app.use('/auth-service/api/', router);

//start server
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});



