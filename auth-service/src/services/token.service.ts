import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import {UserModel} from '../models/user.model';

dotenv.config();


interface TokenPayload {
	uid: string;
	username: string;
	exp: number;
}

const tokenSettings = {
	accessToken: {
		//refresh token expires in 15 minutes
		expiresIn: 15 * 60 * 1000 + Date.now(),
		secret: process.env.ACCESS_TOKEN_SECRET
	},
	refreshToken: {
		//refresh token expires in 365 days
		expiresIn: 365 * 24 * 60 * 60 * 1000 + Date.now(),
		secret: process.env.REFRESH_TOKEN_SECRET
	}
}

export class TokenService {
	public static createAccessToken(user: UserModel): string {
		return jwt.sign({
			uid: user.uid,
			username: user.username,
			exp: tokenSettings.accessToken.expiresIn
		}, tokenSettings.accessToken.secret);
	}

	public static createRefreshToken(user: UserModel): string {
		return jwt.sign({
			uid: user.uid,
			username: user.username,
			exp: tokenSettings.refreshToken.expiresIn
		}, tokenSettings.refreshToken.secret);
	}

	public static verifyAccessToken(token: string): TokenPayload {
		return jwt.verify(token, tokenSettings.accessToken.secret);
	}

	public static verifyRefreshToken(token: string) {
		return jwt.verify(token, tokenSettings.refreshToken.secret);
	}
}
