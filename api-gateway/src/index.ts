import express from 'express';
import dotenv from 'dotenv';
import router from "./routes/router";
dotenv.config();
const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log('Listen on port: ' +  process.env.PORT)
});

app.use('/api/', router);




