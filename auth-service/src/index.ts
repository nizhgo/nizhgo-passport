import cookies from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import router from "./routes/auth.routes";

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookies());
app.use(cors());

app.use('/auth-service/api/', router);
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});



