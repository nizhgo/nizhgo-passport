import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import {RefreshTokenModel} from "../models/refreshToken.model";
import {UserModel} from '../models/user.model';
import {HeaderService} from "./header.service";

dotenv.config();


interface TokenPayload {
	uid: string;
	username: string;
	exp: number;
}

const tokenSettings = {
	accessToken: {
		//refresh token expires in 10 minutes
		expiresIn: 10 * 60 * 1000 + Date.now(),
		secret: process.env.ACCESS_TOKEN_SECRET
	},
	refreshToken: {
		//refresh token expires in 365 days
		expiresIn: 365 * 24 * 60 * 60 * 1000 + Date.now(),
		secret: process.env.REFRESH_TOKEN_SECRET
	}
}

export class TokenService {
	public static generateAccessToken(refreshToken: string): string {
		try {
			console.log('refreshToken', refreshToken);
			const decoded = jwt.verify(refreshToken, tokenSettings.refreshToken.secret) as TokenPayload;
			return jwt.sign({
				uid: decoded.uid,
				username: decoded.username,
				exp: tokenSettings.accessToken.expiresIn
			}, tokenSettings.accessToken.secret);
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	public static generateRefreshToken(user: UserModel): string {
		const userUid = user.uid;
		const username = user.username;
		try {
			return jwt.sign({
				uid: userUid,
				username: username,
				exp: tokenSettings.refreshToken.expiresIn
			}, tokenSettings.refreshToken.secret);
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	public static verifyAccessToken(token: string): TokenPayload {

		try {
			const decoded = jwt.verify(token, tokenSettings.accessToken.secret) as TokenPayload;
			return decoded;
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	public static verifyRefreshToken(token: string): TokenPayload {
		try {
			const decoded = jwt.verify(token, tokenSettings.refreshToken.secret) as TokenPayload;
			return decoded;
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	public static isTokenExpired(token: string): boolean {
		//cut all кроме Payload
		const payload = token.split('.')[1];
		//convert to base64 and then to utf-8
		const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
		//get json payload
		const jsonPayload = JSON.parse(decodedPayload) as TokenPayload;
		//get expiration date
		const exp = jsonPayload.exp;
		//check if token is expired
		return exp < Date.now();
	}

	public static createRefreshTokenModel(token: string, user: UserModel, req: Request): RefreshTokenModel {
		try {
			const browser = HeaderService.getBrowser(req);
			const device = HeaderService.getDevice(req);
			const now = new Date();
			const refreshToken: RefreshTokenModel = {
				user_uid: user.uid,
				token: token,
				created_at: now,
				browser: browser,
				device: device,
				isDisabled: false,
				last_used_at: now
			};
			return refreshToken;
		}
		catch (err) {
			throw new Error(err.message);
		}
	}
}
