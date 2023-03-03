import {Router} from "express";
import ProfileController from "../controllers/profile.controller";
const profileRouter = Router();

profileRouter.get('/profile', ProfileController.getProfile);
profileRouter.post('/edit', ProfileController.editProfile);
export default profileRouter;