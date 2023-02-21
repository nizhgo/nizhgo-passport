import express from 'express';
import dotenv from "dotenv";
import { Pool, QueryResult } from "pg";
import {UserModel} from "../models/user.model";
import {PasswordService} from "../services/password.service";

dotenv.config();
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT || '5432'),
});


export class UsersRepository {
	public static async getUserByUsername(username: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM users WHERE username = $1",
				[username]
			);
			const user: UserModel = result.rows[0];
			return user;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	public static async getUserByEmail(email: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM users WHERE email = $1",
				[email]
			);
			const user: UserModel = result.rows[0];
			return user;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	public static async getUserById(id: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM users WHERE id = $1",
				[id]
			);
			const user: UserModel = result.rows[0];
			return user;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

public static async createUser(user: UserModel): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"INSERT INTO users (username, email, password_hash, salt, is_disabled) VALUES ($1, $2, $3, $4, $5) RETURNING *",
				[user.username, user.email, user.passwordHash, user.salt, user.isDisabled]
			);
			const newUser: UserModel = result.rows[0];
			return newUser;
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}





