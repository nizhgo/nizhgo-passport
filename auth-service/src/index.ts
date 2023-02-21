import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import router from "./routes/auth.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth-service/', router);

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});


