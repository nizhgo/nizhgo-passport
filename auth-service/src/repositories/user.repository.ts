import {QueryResult} from "pg";
import pool from "../database/database";
import {UserModel} from "../models/user.model";


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

	public static async getUserByUid(uid: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM users WHERE uid = $1",
				[uid]
			);
			const user: UserModel = result.rows[0];
			return user;
		}
		catch (error) {
			console.log(error);
			return null;
		}
	}

public static async createUser(user: UserModel): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"INSERT INTO users (uid, username, email, password_hash, salt, created_at, updated_at, is_disabled) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
				[user.uid, user.username, user.email, user.password_hash, user.salt, user.createdAt, user.updatedAt, user.isDisabled]
			);
			const newUser: UserModel = result.rows[0];
			return newUser;
		}
		catch (error) {
			console.log(error);
			return null;
		}
}

	public static async updateUserPassword(uid: string, passwordHash: string, salt: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"UPDATE users SET password_hash = $1, salt = $2 updated_at = NOW() WHERE id = $3 RETURNING *",
				[passwordHash, salt, uid]
			);
			const user: UserModel = result.rows[0];
			return user;
		}
		catch (error) {
			console.log(error);
			return null;
		}
	}
}


