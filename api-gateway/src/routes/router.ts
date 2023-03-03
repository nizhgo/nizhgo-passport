import {Router} from "express";
import authRouter from "./auth.router";
import profileRouter from "./profile.router";
const router = Router();

router.use('/profile', authRouter);
router.use('/auth', profileRouter);

export default router