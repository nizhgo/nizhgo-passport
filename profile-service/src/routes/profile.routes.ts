import {Response, Request, Router} from "express";
import ProfileController from "../controllers/profile.controller";
const router = new Router();

//GET METHODS

router.get('/profile', ProfileController.profile_get);

//POST METHODS

router.post('/profile', ProfileController.profile_create_post);

export default router;

