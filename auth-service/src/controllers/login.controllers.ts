import {
	Request,
	Response
} from "express";
import {TokensRepository} from "../repositories/tokens.repository";
import {UsersRepository} from "../repositories/user.repository";
import {PasswordService} from "../services/password.service";
import {TokenService} from "../services/token.service";

export class LoginControllers {
	public static async login(req: Request, res: Response): Promise<void> {
		try {
			const {login, password} = req.body;
			if (!login || !password) {
				return await res.status(400).json({message: "Incorrect request"});
			}
			const userByEmail = await UsersRepository.getUserByEmail(login);
			const userByUsername = await UsersRepository.getUserByUsername(login);
			const user = userByEmail || userByUsername;
			if (!user) {
				return await res.status(400).json({message: "User not exists"});
			}
			if (user.isDisabled) {
				return await res.status(400).json({message: "User is disabled, please contact support"});
			}
			const passwordHash = PasswordService.hashPassword(password, user.salt);
			if (passwordHash !== user.password_hash) {
				return await res.status(400).json({message: "Incorrect password"});
			}
			const refreshToken = TokenService.generateRefreshToken(user);
			const accessToken = TokenService.generateAccessToken(refreshToken);
			const refreshTokenModel = TokenService.createRefreshTokenModel(refreshToken, user, req);
			await TokensRepository.saveRefreshToken(refreshTokenModel);
			//res.setHeader('Set-Cookie', `refreshToken=${refreshToken};HttpOnly; Secure; SameSite=None; Path=/`);
			res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
			return await res.status(200).json({accessToken});
		}
		catch (err) {
			console.log(err);
			return await res.status(500).json({message: err.message});
		}

	}

	public static async logout(req: Request, res: Response): Promise<void> {
		const {refreshToken} = req.body;
		if (!refreshToken) {
			return await res.status(400).json({message: "Incorrect request"});
		}
		const token = await TokensRepository.getRefreshTokenByToken(refreshToken);
		if (!token) {
			return await res.status(400).json({message: "Incorrect request"});
		}
		await TokensRepository.disableRefreshTokenByToken(refreshToken, 'user logout');
		await res.status(200).json({message: "Logout successful"});
	}
}
