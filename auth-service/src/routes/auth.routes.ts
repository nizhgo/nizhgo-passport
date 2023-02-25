import express from 'express';
import {LoginControllers} from "../controllers/login.controllers";
import PasswordController from "../controllers/password.controller";
import {RegistrationController} from "../controllers/registration.controller";
import {TokenController} from "../controllers/token.controller";
import {UserController} from "../controllers/user.controller";
import {authMiddleware} from "../middlewares/auth";

const router = express.Router();

router.post('/login', LoginControllers.login);
router.post('/register', RegistrationController.registerUser);
router.get('/ping', (req, res) => res.status(200).json({message: "pong"}));
//protected routes

router.post('/disableToken', authMiddleware, TokenController.disableToken);
router.post('/logout', authMiddleware, LoginControllers.logout);
router.get('/refresh-token', TokenController.validateRefreshToken, TokenController.reissueAccessToken);
router.post('/changePassword', TokenController.validateAccessToken, PasswordController.changePassword);
router.get('/user', authMiddleware, UserController.getUser);
router.get('/active-tokens', authMiddleware, UserController.getActiveRefreshTokens);
router.get('/auth-ping', authMiddleware, (req, res) => res.status(200).json({message: "pong"}));

export default router;
