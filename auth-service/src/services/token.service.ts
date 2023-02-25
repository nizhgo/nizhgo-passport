import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import {RefreshTokenModel} from "../models/refreshToken.model";
import {UserModel} from '../models/user.model';
import {HttpService} from "./http.service";
import {TokenPayload} from "../models/tokenPayload.model";

dotenv.config();


/** Tokens settings
 * @typedef {Object} TokenSettings
 * @property {Object} accessToken - access token settings
 * @property {Object} refreshToken - refresh token settings
 * @property {string} accessToken.secret - secret for access token
 * @property {number} accessToken.expiresIn - access token expires on N (UNIX timestamp)
 * @property {string} refreshToken.secret - secret for refresh token
 * @property {number} refreshToken.expiresIn - refresh token expires in N (UNIX timestamp)
 */
export const tokenSettings = {
	accessToken: {
		//refresh token expires in 10 minutes
		expiresIn: 15 * 60 * 1000 + Date.now(),
		secret: process.env.ACCESS_TOKEN_SECRET
	},
	refreshToken: {
		//refresh token expires in 365 days
		expiresIn: 365 * 24 * 60 * 60 * 1000 + Date.now(),
		secret: process.env.REFRESH_TOKEN_SECRET
	}
}


 /** Service class for handling JWT token-related functionality like generating access tokens, refresh tokens, verifying tokens, and creating a refresh token model
 * @class TokenService
 */
export class TokenService {

	 /** Generate access token based on refresh token
	  * @param refreshToken
	  * @returns {string} Access token
	  */
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

	 /** Generate refresh token based on user object {UserModel}
	  * @param user {UserModel} - user object
	  * @returns {string} Refresh token
	  * @throws {Error} if user is undefined or null
	  */
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

	 /** Verify (decode) access token and return payload
	  * @param token {string} - access token
	  * @returns {TokenPayload} Payload of access token
	  */
	public static verifyAccessToken(token: string): TokenPayload {

		try {
			const decoded = jwt.verify(token, tokenSettings.accessToken.secret) as TokenPayload;
			return decoded;
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	 /** Verify (decode) refresh token and return payload
	  * @param token {string} - refresh token
	  * @returns {TokenPayload} Payload of refresh token
	  * @throws {Error} if token is invalid
	  */
	public static verifyRefreshToken(token: string): TokenPayload {
		try {
			const decoded = jwt.verify(token, tokenSettings.refreshToken.secret) as TokenPayload;
			return decoded;
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	 /** Check if access token is expired
	  * @param token {string} - access or refresh token
	  * @returns {boolean} true if token is expired, false if token is not expired
	  * @throws {Error} if token is invalid
	  */
	public static isTokenExpired(token: string): boolean {
		try {
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
		catch (err) {
			throw new Error(err.message);
		}
	}

	 /** Create refresh token model based on refresh token, user object, and request object
	  * @param token {string} - refresh token
	  * @param user {UserModel} - user object
	  * @param req {Request} - request object
	  * @returns {RefreshTokenModel} Refresh token model
	  */
	public static createRefreshTokenModel(token: string, user: UserModel, req: Request): RefreshTokenModel {
		try {
			const browser = HttpService.getBrowser(req);
			const device = HttpService.getDevice(req);
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
