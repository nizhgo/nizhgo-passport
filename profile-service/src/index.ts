import {Router, Response, Request} from "express";
import router from "./routes/profile.routes";
import {errorHandler} from "./middlewares/error.middleware";
import dotenv from "dotenv";

dotenv.config();

const app = Router();
app.use(errorHandler);
app.use(process.env.PROFILE_SERVICE_APP_PORT, router);


