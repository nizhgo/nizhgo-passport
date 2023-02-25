import {
	Request,
	Response
} from "express";
import {TokensRepository} from "../repositories/tokens.repository";
import {UsersRepository} from "../repositories/user.repository";
import {HttpService} from "../services/http.service";
import {TokenService} from "../services/token.service";

export class TokenController {

	/**
	 * Create refresh token for user by uid and save it to db
	 * @param req - request
	 * @param res - response
	 */
	public static async createRefreshToken(req: Request, res: Response): Promise<void> {
		const {userId} = req.params;
		const user = await UsersRepository.getUserByUid(userId);
		if (!user) {
			return await res.status(400).json({message: "User not exists"});
		}
		if (user.isDisabled) {
			return await res.status(400).json({message: "User is disabled, please contact support"});
		}
		const refreshToken = TokenService.generateRefreshToken(user);
		const refreshTokenModel = TokenService.createRefreshTokenModel(refreshToken, user, req);
		await TokensRepository.saveRefreshToken(refreshTokenModel);
		await res.status(200).json({refreshToken: refreshToken});
	}

	/**
	 * This method is used to disable refresh token in database by user manually
	 * @param req - request
	 * @param res - response
	 */
	public static async disableToken(req: Request, res: Response): Promise<void> {
		const refreshToken = HttpService.getAuthorizationHeader(req);
		await TokensRepository.disableRefreshTokenByToken(refreshToken, 'user manually disabled');
		await res.status(200).json({message: "Refresh token disabled successfully"});
	}

	/**
	 * This method (middleware) is used to validate refresh token in request body
	 * @param req - request
	 * @param res - response
	 * @param next - next middleware or controller
	 */
	public static async validateRefreshToken(req: Request, res: Response, next: any): Promise<void> {
		const refreshToken = HttpService.getRefreshTokenFromCookie(req);
		if (!refreshToken) {
			return await res.status(400).json({message: "Incorrect request"});
		}
		const isExpired = TokenService.isTokenExpired(refreshToken);
		if (isExpired) {
			return await res.status(401).json({message: "Token expired"});
		}
		const token = await TokensRepository.getRefreshTokenByToken(refreshToken);
		if (!token) {
			return await res.status(401).json({message: "Incorrect token"});
		}
		if (token.isDisabled) {
			return await res.status(401).json({message: "This refresh token is disabled"});
		}
		next();
	}

	/**
	 * This method (middleware) is used to validate access token in request
	 * @param req
	 * @param res
	 * @param next
	 */

	public static async validateAccessToken(req: Request, res: Response, next: any): Promise<void> {
		const accessToken = HttpService.getAuthorizationHeader(req);
		if (!accessToken) {
			return await res.status(400).json({message: "Incorrect request"});
		}
		const decodedToken = TokenService.verifyAccessToken(accessToken);
		if (!decodedToken) {
			return await res.status(401).json({message: "Incorrect token"});
		}
		const isExpired = TokenService.isTokenExpired(accessToken);
		if (isExpired) {
			return await res.status(401).json({message: "Token is expired"});
		}
		const token = await TokensRepository.getAccessTokenByToken(accessToken);
		if (!token) {
			return await res.status(401).json({message: "Incorrect token"});
		}
		if (token.isDisabled) {
			return await res.status(401).json({message: "This access token is disabled"});
		}
		next();
	}


	/**
	 * This method is used to reissue access token if refresh token is valid
	 * @param req - request
	 * @param res - response
	 */
	public static async reissueAccessToken(req: Request, res: Response): Promise<void> {
		const refreshToken = HttpService.getRefreshTokenFromCookie(req);
		try {
			const accessToken = TokenService.generateAccessToken(refreshToken);
			await TokensRepository.updateLastUsedAt(refreshToken);
			return await res.status(200).json({accessToken: accessToken});
		}
		catch (e) {
			return await res.status(401).json({message: "Something went wrong"});
		}
	}

}
