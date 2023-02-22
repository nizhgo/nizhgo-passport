import express from 'express';
import {AuthController} from '../controllers/auth.controller';
import {authMiddleware} from "../middlewares/auth";

const router = express.Router();

router.post('/reg', AuthController.registration);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/ping', (req, res) => {
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

router.post('/logout', authMiddleware, AuthController.logout);
router.post('/disableToken', authMiddleware, AuthController.disableToken);
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

router.post('/changePassword', authMiddleware, AuthController.changePassword);
router.get('/getUser', authMiddleware, AuthController.getUser);
router.post('/getActiveSessions', authMiddleware, AuthController.getActiveSessions);
//protected routes


export default router;
