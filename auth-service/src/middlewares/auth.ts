import dotenv from "dotenv";
import {
	NextFunction,
	Request,
	Response
} from "express";
import {UsersRepository} from "../repositories/user.repository";
import {HttpService} from "../services/http.service";
import {TokenService} from "../services/token.service";

dotenv.config();

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const accessToken = HttpService.getAccessToken(req);
		const decodedToken = await TokenService.verifyAccessToken(accessToken);
		if (!decodedToken) {
			return res.status(401).json({message: 'Invalid access token'});
		}
		const user = await UsersRepository.getUserByUid(decodedToken.uid);
		console.log('user', user);
		if (!user || user.isDisabled) {
			return res.status(401).json({message: 'User is disabled'});
		}
		if (decodedToken.exp < Date.now()) {
			return res.status(401).json({message: 'Token expired'});
		}
	}
	catch (err) {
		return res.status(403).json({message: err.message});
	}
	next();
};





