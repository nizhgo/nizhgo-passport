import express from 'express';
import {LoginControllers} from "../controllers/login.controllers";
import PasswordController from "../controllers/password.controller";
import {RegistrationController} from "../controllers/registration.controller";
import {TokenController} from "../controllers/token.controller";
import {UserController} from "../controllers/user.controller";
import {authMiddleware} from "../middlewares/auth";
import {HeaderService} from "../services/header.service";

const router = express.Router();

router.post('/reg', RegistrationController.registerUser);
router.post('/login', LoginControllers.login);
// router.post('/refresh', TokenController.refreshAccessToken);
router.get('/ping', (req, res) => {
	const browser = HeaderService.getBrowser(req);
	const device = HeaderService.getDevice(req);
	res.status(200)
		.send(JSON.stringify({
			message: 'pong',
			date: new Date(),
			'user-agent': req.headers['user-agent'],
			"your-ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
			"your-send": req.body,
			browser,
			device
		}));
	res.end();
});

router.post('/logout', authMiddleware, LoginControllers.logout);
router.post('/disableToken', authMiddleware, TokenController.disableToken);


//protected routes

router.post('/sping', authMiddleware, (req, res) => {
	res.status(200)
		.send(JSON.stringify({
			message: 'pong',
			date: new Date(),
			'user-agent': req.headers['user-agent'],
			"your-ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
			"your-send": req.body
		}));
	res.end();
});

router.get('/reissueAccessToken', TokenController.validateRefreshToken, TokenController.reissueAccessToken);
router.post('/changePassword', TokenController.validateAccessToken, PasswordController.changePassword);
router.post('/getActiveSessions', authMiddleware, UserController.getActiveRefreshTokens);


export default router;
