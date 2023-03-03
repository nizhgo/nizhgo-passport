import {Router} from "express";
import AuthController from "../controllers/auth.controller";
const authRouter = Router();

authRouter.post('/signin', AuthController.login);
authRouter.post('/signup', AuthController.register);
authRouter.get('/signout', AuthController.logout);
export default authRouter;