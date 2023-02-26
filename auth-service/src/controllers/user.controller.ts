import {
	Request,
	Response
} from "express";
import {UserModel} from "../models/user.model";
import {TokensRepository} from "../repositories/tokens.repository";
import {UsersRepository} from "../repositories/user.repository";
import {HttpService} from "../services/http.service";
import {TokenService} from "../services/token.service";
import {UserService} from "../services/user.service";


/** User controller
 * @class UserController
 * @description User controller class with static methods for user.
 * @static
 * @exports UserController
 * @version 1.0.0
 */
export class UserController {

	/** Get user method for user.
	 * @method getUser
	 * @description Get user from database by uid in access token. Return user json object.
	 * @param req {Request} - request
	 * @param res {Response} - response
	 * @throws {Error} - if user not found in database or user form database is not valid.
	 * @return {Promise<void>} - void. but response with user object or error message
	 */
	public static async getUser(req: Request, res: Response): Promise<void> {
		try {
			const accessToken = HttpService.getTokenFromHeader(req);
			const decodedToken = await TokenService.verifyAccessToken(accessToken);
			const userResponse = await UsersRepository.findUserByUid(decodedToken.uid);
			const user: UserModel = UserService.mapUser(userResponse);
			const {uid, username, email, createdAt, updatedAt} = user;
			await res.status(200).json({uid, username, email, createdAt, updatedAt});
		}
		catch (err) {
			return res.status(401).json({message: err.message});
		}
	}

	/** Get active refresh tokens method for user.
	 * @method getActiveRefreshTokens
	 * @description Get active refresh tokens from database by uid in access token. Return json array of active refresh tokens.
	 * @param req {Request} - request
	 * @param res {Response} - response
	 * @throws {Error} - if user not found in database or user form database is not valid.
	 * @return {Promise<void>} - void. but response with refresh tokens array or error message
	 */
	public static async getActiveRefreshTokens(req: Request, res: Response): Promise<void> { //return all active tokens for user
		try {
			const accessToken = HttpService.getTokenFromHeader(req);
			const decodedToken = await TokenService.verifyAccessToken(accessToken);
			const activeRefreshTokens = await TokensRepository.getActiveTokensByUserUid(decodedToken.uid);
			//return array in format {id, device: string, browser: string, created_at: string, last_used_at: string}
			const result = activeRefreshTokens.map(token => {
				const {id, device, browser, created_at, last_used_at} = token;
				return {id, device, browser, created_at, last_used_at};
			});
			await res.status(200).json(result);
		}
		catch (err) {
			return res.status(401).json({message: err.message});
		}
	}
}
