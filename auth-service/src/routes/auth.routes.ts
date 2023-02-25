import express from 'express';
import {LoginControllers} from "../controllers/login.controllers";
import PasswordController from "../controllers/password.controller";
import {RegistrationController} from "../controllers/registration.controller";
import {TokenController} from "../controllers/token.controller";
import {UserController} from "../controllers/user.controller";
import {authMiddleware} from "../middlewares/auth";
import {errorHandler} from "../middlewares/error.middleware";

const router = express.Router();

router.post('/login',  LoginControllers.login, errorHandler);
router.post('/register', errorHandler,  RegistrationController.registerUser, errorHandler);
router.get('/ping',  (req, res) => res.status(200).json({message: "pong"}, errorHandler));
//protected routes

router.post('/disableToken', authMiddleware, TokenController.disableToken, errorHandler);
router.post('/logout', authMiddleware, LoginControllers.logout, errorHandler);
router.get('/refresh-token', TokenController.validateRefreshToken, TokenController.reissueAccessToken, errorHandler);
router.post('/changePassword', TokenController.validateAccessToken, PasswordController.changePassword, errorHandler);
router.get('/user', authMiddleware, UserController.getUser, errorHandler);
router.get('/active-tokens', authMiddleware, UserController.getActiveRefreshTokens, errorHandler);
router.get('/auth-ping', authMiddleware, (req, res) => res.status(200).json({message: "pong"}, errorHandler));

export default router;
