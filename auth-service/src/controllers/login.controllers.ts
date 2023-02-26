import {
	Request,
	Response
} from "express";
import {TokensRepository} from "../repositories/tokens.repository";
import {UsersRepository} from "../repositories/user.repository";
import {HttpService} from "../services/http.service";
import {PasswordService} from "../services/password.service";
import {TokenService} from "../services/token.service";

/** Login controller class with static methods */
export class LoginControllers {
	/**
	 * This function is responsible for user login. It receives login and password from the request body, validates them,
	 * generates an access token and a refresh token, saves the refresh token to the database and sets the refresh token to
	 * the HttpOnly cookie on the response object.
	 *
	 * @static
	 * @param {Request} req - The express request object
	 * @param {Response} res - The express response object
	 * @returns {Promise<void>} - Returns void. But sends a response to the client.
	 */
	public static async login(req: Request, res: Response): Promise<void> {
		try {
			const {login, password} = req.body;
			if (!Boolean(login)) {
				return await res.status(400).json({message: "Login is required"});
			}
			if (!Boolean(password)) {
				return await res.status(400).json({message: "Password is required"});
			}
			const userByEmail = await UsersRepository.findUserByEmail(login);
			const userByUsername = await UsersRepository.findUserByUsername(login);
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
			return await res.status(200).json({accessToken}, {refreshToken});
		}
		catch (err) {
			console.log(err);
			return await res.status(500).json({message: err.message});
		}
	}

	/**
	 * This function is responsible for user logout. It gets the refresh token from the HttpOnly cookie on the request object,
	 * disables the token in the database and clears the cookie on the response object.
	 *
	 * @static
	 * @param {Request} req - The express request object
	 * @param {Response} res - The express response object
	 * @returns {Promise<void>} - Returns void. But sends a response to the client.
	 */
	public static async logout(req: Request, res: Response): Promise<void> {
		const refreshToken = HttpService.getTokenFromHeader(req);
		//clear refresh token cookie
		HttpService.setRefreshTokenCookie(res, '');
		await TokensRepository.disableRefreshTokenByToken(refreshToken, 'user logout');
		await res.status(200).json({message: "Logout successful"});
	}

}
