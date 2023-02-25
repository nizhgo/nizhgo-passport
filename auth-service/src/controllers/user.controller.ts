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


export class UserController {
	public static async getUser(req: Request, res: Response): Promise<void> {
		try {
			const accessToken = HttpService.getAccessToken(req);
			const decodedToken = await TokenService.verifyAccessToken(accessToken);
			const userResponse = await UsersRepository.getUserByUid(decodedToken.uid);
			const user: UserModel = UserService.mapUser(userResponse);
			await res.status(200).json(user);
		}
		catch (err) {
			return res.status(401).json({message: err.message});
		}
	}

	public static async getActiveRefreshTokens(req: Request, res: Response): Promise<void> { //return all active tokens for user
		try {
			const accessToken = HttpService.getAccessToken(req);
			const decodedToken = await TokenService.verifyAccessToken(accessToken);
			const activeRefreshTokens = await TokensRepository.getActiveTokensByUserUid(decodedToken.uid);
			//return in format {id, device: string, browser: string, created_at: string, last_used_at: string}
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
