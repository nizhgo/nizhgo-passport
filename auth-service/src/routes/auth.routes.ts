import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
// router.post('/logout', AuthController.revokeToken);
// router.post('/refresh', AuthController.refreshToken);
router.post('/is-valid-token', AuthController.isTokenValid);
router.post('/ping', (req, res) => {
	res.status(200).send(JSON.stringify({ message: 'pong', date: new Date(), 'user-agent': req.headers['user-agent'] , "your-ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress , "your-send": req.body}));
	res.end();
});

export default router;
