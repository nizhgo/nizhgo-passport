import {
	Request,
	Response
} from "express";
import {v4 as uuidv4} from "uuid";
import {UserModel} from "../models/user.model";
import {TokensRepository} from "../repositories/tokens.repository";
import {UsersRepository} from "../repositories/user.repository";
import {PasswordService} from "../services/password.service";
import {TokenService} from "../services/token.service";


export class RegistrationController {
	public static registerUser = async (req: Request, res: Response): Promise<void> => {
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

			// check if email is valid with regex
			const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({message: "Invalid email"});
			}

			// check if user already exists
			const existingUsername = await UsersRepository.getUserByUsername(username);
			if (existingUsername) {
				return res.status(400).json({message: "Username already exists"});
			}
			const existingEmail = await UsersRepository.getUserByEmail(email);
			if (existingEmail) {
				return res.status(400).json({message: "Email already exists"});
			}

			// all checks passed, create user
			const salt = PasswordService.createSalt();
			const passwordHash = PasswordService.hashPassword(password, salt);

			const user: UserModel = {
				uid: uuidv4(),
				username: username,
				password_hash: passwordHash,
				email: email,
				salt: salt,
				createdAt: new Date(),
				updatedAt: new Date(),
				isDisabled: false,
			};

			const regResult = await UsersRepository.createUser(user);
			if (regResult) {
				// create access and refresh token
				const refreshToken = TokenService.generateRefreshToken(user);
				const accessToken = TokenService.generateAccessToken(user.uid);
				// save refresh token to db
				const refreshTokenModel = TokenService.createRefreshTokenModel(refreshToken, user, req);
				await TokensRepository.saveRefreshToken(refreshTokenModel);
				// send response
				await res.status(200).json({accessToken}).setCookie('refreshToken', refreshToken, {
						httpOnly: true,
					}
				);
			}
			else {
				await res.status(500).json({message: "Registration failed, please try again later"});
			}
		}
		catch (err) {
			console.error(err);
			await res.status(500).json({message: "Registration failed, please try again later"});
		}
	};
}


