import {
	Request,
	Response
} from "express";
import {TokensRepository} from "../repositories/tokens.repository";
import {HeaderService} from "../services/header.service";
import {TokenService} from "../services/token.service";


export class UserController {
	public static async getUser(req: Request, res: Response): Promise<void> {
		try {
			const accessToken = HeaderService.getAccessToken(req);
			const decodedToken = await TokenService.verifyAccessToken(accessToken);
			const tokens = await TokensRepository.getActiveTokensByUserUid(decodedToken.uid);

		}
		catch (err) {
			return res.status(401).json({message: err.message});
		}
	}

	public static async getActiveRefreshTokens(req: Request, res: Response): Promise<void> { //return all active tokens for user
		try {
			const accessToken = HeaderService.getAccessToken(req);
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
