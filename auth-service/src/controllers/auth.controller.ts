import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";
import {UserModel} from "../models/user.model";
import { UsersRepository } from "../repositories/user.repository";
import { PasswordService } from "../services/password.service";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: (process.env.DB_PASSWORD || 'test').toString(),
	port: parseInt(process.env.DB_PORT),
});

console.log("DB_USER: " + process.env.DB_USER);

pool.query('SELECT NOW()', (err, res) => {
	if (err) {
		console.error(err);
	} else {
		console.log(res.rows[0]);
	}
	// pool.end();
});


class AuthController {
	public async register(req: Request, res: Response): Promise<void> {
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
			const existingUsername  = await UsersRepository.getUserByUsername(username);
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
				id: uuidv4(),
				username: username,
				passwordHash: passwordHash,
				email: email,
				salt: salt,
				createdAt: new Date(),
				updatedAt: new Date(),
				isDisabled: false
			}

			const regResult = await UsersRepository.createUser(user);
			if (regResult) {
				jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "1h"}, (err, token) => {
					if (err) {
						console.error(err);
						res.status(500).json({message: "Registration failed, please try again later"});
					}
					else {
						res.status(201).json({token});
					}
				});
			}
			else {
				res.status(500).json({message: "Registration failed, please try again later"});
			}
		}
		catch (err) {
			console.error(err);
			res.status(500).json({message: "Registration failed, please try again later"});
		}
	}

	public async login(req: Request, res: Response): Promise<void> {
		try {
			const {username, password} = req.body;

			const user = await UsersRepository.getUserByUsername(username);
			if (!user) {
				return res.status(404).json({message: "User not found"});
			}

			const passwordHash = PasswordService.hashPassword(password, user.salt);

			if (passwordHash !== user.passwordHash) {
				return res.status(401).json({message: "Invalid credentials"});
			}

			jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "1h"}, (err, token) => {
				if (err) {
					console.error(err);
					res.status(500).json({message: "Login failed, please try again later"});
				}
				else {
					res.status(200).json({token});
				}
			});
		}
		catch (err) {
			console.error(err);
			res.status(500).json({message: "Login failed, please try again later"});
		}
	}

	public isTokenValid(req: Request, res: Response): void {
		const {token} = req.body;
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				res.status(401).json({message: "Invalid token"});
			}
			else {
				//decode token to get user data
				const {user} = jwt.decode(token) as {user: UserModel};
				res.status(200).json({user});
			}
		}
		);
	}
}

export default new AuthController();


