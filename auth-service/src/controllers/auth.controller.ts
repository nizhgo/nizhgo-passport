import {
	Request,
	Response
} from "express";
import {v4 as uuidv4} from 'uuid';
import {UserModel} from "../models/user.model";
import {TokensRepository} from "../repositories/tokens.repository";
import {UsersRepository} from "../repositories/user.repository";
import {PasswordService} from "../services/password.service";
import {TokenService} from "../services/token.service";

export class AuthController {
	public static async registration(req: Request, res: Response): Promise<void> {
		try {
			const {username, password, email} = req.body;

			if (username.length < 3) {
				return res.status(400).json({message: "Username must be at least 3 characters long"});
			}

			const usernameRegex = /^[a-zA-Z0-9]+$/;
			if (!usernameRegex.test(username)) {
				return res.status(400).json({message: "Username must contain only letters and numbers"});
			}

			if (password.length < 6) {
				return res.status(400).json({message: "Password must be at least 6 characters long"});
			}

			//check if email is valid with regex
			const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({message: "Invalid email"});
			}

			//check if user already exists
			const existingUsername = await UsersRepository.getUserByUsername(username);
			if (existingUsername) {
				return res.status(400).json({message: "Username already exists"});
			}
			const existingEmail = await UsersRepository.getUserByEmail(email);
			if (existingEmail) {
				return res.status(400).json({message: "Email already exists"});
			}

			//all checks passed, create user

			const salt = PasswordService.createSalt()
			const passwordHash = PasswordService.hashPassword(password, salt);

			const user: UserModel = {
				uid: uuidv4(),
				username: username,
				password_hash: passwordHash,
				email: email,
				salt: salt,
				createdAt: new Date(),
				updatedAt: new Date(),
				isDisabled: false
			}

			const regResult = await UsersRepository.createUser(user);
			if (regResult) {
				//create access and refresh token
				const accessToken = TokenService.createAccessToken(user);
				const refreshToken = TokenService.createRefreshToken(user);
				//save refresh token to db
				await TokensRepository.saveRefreshToken(refreshToken, user, req);
				await res.status(200).json({accessToken, refreshToken});
			}
			else {
				await res.status(500).json({message: "Registration failed, please try again later"});
			}
		}
		catch (err) {
			console.error(err);
			await res.status(500).json({message: "Registration failed, please try again later"});
		}
	}

	public static async login(req: Request, res: Response): Promise<void> {
		const {indeficator, password} = req.body;
		if (!indeficator || !password) {
			return await res.status(400).json({message: "Incorrect request"});
		}
		const userByEmail = await UsersRepository.getUserByEmail(indeficator);
		const userByUsername = await UsersRepository.getUserByUsername(indeficator);
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
		const accessToken = TokenService.createAccessToken(user);
		const refreshToken = TokenService.createRefreshToken(user);
		await TokensRepository.saveRefreshToken(refreshToken, user, req);
		await res.status(200).json({accessToken, refreshToken});
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

	public static async changePassword(req: Request, res: Response): Promise<void> {
		const {oldPassword, newPassword} = req.body;
		if (!oldPassword || !newPassword) {
			return await res.status(400).json({message: "Incorrect request"});
		}
		const user = await UsersRepository.getUserByUid(req.user.uid);
		if (!user) {
			return await res.status(400).json({message: "User not exists"});
		}
		const passwordHash = PasswordService.hashPassword(oldPassword, user.salt);
		if (passwordHash !== user.password_hash) {
			return await res.status(400).json({message: "Incorrect password"});
		}
		const newSalt = PasswordService.createSalt();
		const newPasswordHash = PasswordService.hashPassword(newPassword, newSalt);
		await UsersRepository.updatePassword(user.uid, newPasswordHash, newSalt);
		await res.status(200).json({message: "Password changed successfully"});
	}

	public static async refreshToken(req: Request, res: Response): Promise<void> {
		const {refreshToken} = req.body;
		if (!refreshToken) {
			return await res.status(400).json({message: "Incorrect request"});
		}
		const token = await TokensRepository.getRefreshTokenByToken(refreshToken);
		if (!token) {
			return await res.status(400).json({message: "Refresh token not exists"});
		}
		if (token.is_disabled) {
			return await res.status(400).json({message: "Refresh token is disabled. Please login again"});
		}
		const user = await UsersRepository.getUserByUid(token.user_uid);
		if (!user) {
			return await res.status(400).json({message: "User not exists"});
		}
		if (user.isDisabled) {
			return await res.status(400).json({message: "User is disabled, please contact support"});
		}
		const accessToken = TokenService.createAccessToken(user);
		return await res.status(200).json({accessToken: accessToken});
	}

	public static async getUser(req: Request, res: Response): Promise<void> {
	}

	public static async disableToken(req: Request, res: Response): Promise<void> {
	const {refreshToken} = req.body;
		if (!refreshToken) {
			return await res.status(400).json({message: "Incorrect request"});
		}
		const token = await TokensRepository.getRefreshTokenByToken(refreshToken);
		if (!token) {
			return await res.status(400).json({message: "Refresh token not exists"});
		}
		if (token.is_disabled) {
			return await res.status(400).json({message: "This refresh token is disabled. Please login again"});
		}
		await TokensRepository.disableRefreshTokenByToken(refreshToken, 'user manual disable');
		await res.status(200).json({message: "Refresh token disabled successfully"});
	}

	public static async getActiveSessions(req: Request, res: Response): Promise<void> { //return all active tokens for user
		const authHeader = req.headers.authorization;
		const accessToken = authHeader.split(" ")[1];
		const user = await TokenService.verifyAccessToken(accessToken);
		const tokens = await TokensRepository.getActiveTokensByUserUid(user.uid);
		//return in format {id, device: string, browser: string, created_at: string, last_used_at: string}
		const result = tokens.map(token => {
				const {id, device, browser, created_at, last_used_at} = token;
				return {id, device, browser, created_at, last_used_at};
			}
		);
		await res.status(200).json(result);
	}


}


