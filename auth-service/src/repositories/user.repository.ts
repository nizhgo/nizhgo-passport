import {QueryResult} from "pg";
import pool from "../database/database";
import {UserModel} from "../models/user.model";
import {UserService} from "../services/user.service";


/** Class representing a user repository on the database. Table: users */

export class UsersRepository {


	/** Find a user by their username
	 * @param {string} username - The username of the user
	 * @returns {UserModel | null} - The user object or null if not found
	 */
	public static async findUserByUsername(username: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM users WHERE username = $1",
				[username]
			);
			const user: UserModel = UserService.mapUser(result.rows[0]);
			return user;
		} catch (error) {
			return null;
		}
	}

	/** Find a user by their email address on the database
	 * @param {string} email - The email address of the user
	 * @returns {UserModel | null} - The user object or null if not found
	 */
	public static async findUserByEmail(email: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM users WHERE email = $1",
				[email]
			);
			const user: UserModel = UserService.mapUser(result.rows[0]);
			return user;
		} catch (error) {
			throw error;
		}
	}

	/** Find a user by their uid on the database
	 * @param {string} uid - The uid of the user
	 * @returns {UserModel | null} - The user object or null if not found
	 */
	public static async findUserByUid(uid: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM users WHERE uid = $1",
				[uid]
			);
			const user: UserModel = UserService.mapUser(result.rows[0]);
			return user;
		}
		catch (error) {
			return null;
		}
	}

	/** Create a new user on the database and return the new user object {uid, username, email, password_hash, salt, created_at, updated_at, is_disabled}
	 * @param {UserModel} user - The user object to be created on the database
	 * @returns {UserModel | null} - The new user from the database or null if failed
	 */
	public static async createUser(user: UserModel): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"INSERT INTO users (uid, username, email, password_hash, salt, created_at, updated_at, is_disabled) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
				[user.uid, user.username, user.email, user.password_hash, user.salt, user.createdAt, user.updatedAt, user.isDisabled]
			);
			const newUser: UserModel = UserService.mapUser(result.rows[0]);
			return newUser;
		}
		catch (error) {
			return null;
		}
}

	/** Update a user's password on the database and return the updated user object {UserModel}
	 * @param {string} uid - The uid of the user
	 * @param {string} passwordHash - The new password hash
	 * @param {string} salt - The new salt
	 * @returns {UserModel | null} - The updated user from the database or null if failed
	 */
	public static async updateUserPassword(uid: string, passwordHash: string, salt: string): Promise<UserModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"UPDATE users SET password_hash = $1, salt = $2 updated_at = NOW() WHERE id = $3 RETURNING *",
				[passwordHash, salt, uid]
			);
			const user: UserModel = UserService.mapUser(result.rows[0]);
			return user;
		}
		catch (error) {
			return null;
		}
	}
}


