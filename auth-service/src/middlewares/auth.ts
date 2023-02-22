import dotenv from "dotenv";
import {
	NextFunction,
	Request,
	Response
} from "express";
import {TokenService} from "../services/token.service";

dotenv.config();

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(401).json({message: 'No authorization header'});
		}

		const accessToken = authHeader.split(" ")[1];
		console.log(authHeader)
		const token = await TokenService.verifyAccessToken(accessToken);
		if (!token) {
			return res.status(401).json({message: 'Invalid access token or token expired'});
		}
	}
	catch (err) {
		return res.status(401).json({message: err.message});
	}
	next();
};

