import dotenv from "dotenv";
import {QueryResult} from "pg";
import pool from "../database/database";
import {RefreshTokenModel} from "../models/refreshToken.model";

dotenv.config();

/** Class representing a refresh token repository on the database. Table: refresh_tokens */

export class TokensRepository {

	/** Save a refresh token to the database and return the result {refreshTokenModel}
	 * @param {RefreshTokenModel} refreshTokenModel - The refresh token model
	 * @returns {QueryResult} - The result of the query
	 * @throws {Error} - Throws an error if the query fails
	 */
	public static async saveRefreshToken(refreshTokenModel: RefreshTokenModel): Promise<RefreshTokenModel> {
		const {user_uid, token, created_at, device, browser, isDisabled, last_used_at} = refreshTokenModel;
		try {
			const result = await pool.query('INSERT INTO refresh_tokens (user_uid, token, created_at, device, browser, is_disabled, last_used_at) VALUES ($1, $2, $3, $4, $5, $6, $7)', [user_uid, token, created_at, device, browser, isDisabled, last_used_at]);
			return result as RefreshTokenModel;
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}


	/** Find a refresh token by its token on the database
	 * @param {string} token - The token of the refresh token
	 * @returns {RefreshTokenModel | null} - The refresh token object or null if not found
	 * @throws {Error} - Throws an error if the query fails
	 */
	public static async getRefreshTokenByToken(token: string): Promise<RefreshTokenModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM refresh_tokens WHERE token = $1",
				[token]
			);
			const refreshToken: RefreshTokenModel = result.rows[0];
			return refreshToken;
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}

	/** Find a refresh token by its user uid on the database
	 * @param {string} uid - The uid of the user
	 * @returns {RefreshTokenModel | null} - The refresh token object or null if not found
	 * @throws {Error} - Throws an error if the query fails
	 */
	public static async getRefreshTokenByUserUid(uid: string): Promise<RefreshTokenModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM refresh_tokens WHERE user_uid = $1",
				[uid]
			);
			const refreshToken: RefreshTokenModel = result.rows[0];
			return refreshToken;
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}

	/** Find a refresh token by its user uid on the database
	 * @param {string} uid - The uid of the user
	 * @returns {RefreshTokenModel} - The refresh token object or null if not found
	 * @throws {Error} - Throws an error if the query fails
	 */
	public static async disableRefreshTokenByToken(token: string, disableReason: string): Promise<QueryResult> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM refresh_tokens WHERE token = $1",
				[token]
			);
			const refreshToken: RefreshTokenModel = result.rows[0];
			return refreshToken;
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}

	/** Update the last used at date of a refresh token
	 * @param {string} token - The token of the refresh token
	 * @returns {RefreshTokenModel} - The refresh token object or null if not found
	 * @throws {Error} - Throws an error if the query fails
	 */
	public static async updateLastUsedAt(token: string): Promise<QueryResult> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM refresh_tokens WHERE token = $1",
				[token]
			);
			const refreshToken: RefreshTokenModel = result.rows[0];
			return refreshToken;
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}

	/** Delete a refresh token by its token
	 * @param {string} token - The token of the refresh token
	 * @returns {QueryResult} - The result of the query
	 * @throws {Error} - Throws an error if the query fails
	 */
	public static async disableRefreshTokenByUserUid(uid: string, disableReason: string): Promise<void> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM refresh_tokens WHERE user_uid = $1",
				[uid]
			);
			for (const refreshToken of result.rows) {
				refreshToken.is_disabled = true;
				refreshToken.disable_reason = disableReason;
				refreshToken.disabled_at = new Date();
				await pool.query(
					"UPDATE refresh_tokens SET is_disabled = $1, disable_reason = $2, disabled_at = $3 WHERE user_uid = $4",
					[refreshToken.is_disabled, refreshToken.disable_reason, refreshToken.disabled_at, refreshToken.user_uid]
				);
			}
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}

	/** Delete a refresh token by its token
	 * @param {string} token - The token of the refresh token
	 * @returns {QueryResult} - The result of the query
	 * @throws {Error} - Throws an error if the query fails
	 */
	public static async getActiveTokensByUserUid(uid: string): Promise<RefreshTokenModel[]> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM refresh_tokens WHERE user_uid = $1 AND is_disabled = false",
				[uid]
			);
			return result.rows;
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}

	public static async getAccessTokenByToken(token: string): Promise<RefreshTokenModel | null> {
		try {
			const result: QueryResult = await pool.query(
				"SELECT * FROM refresh_tokens WHERE token = $1",
				[token]
			);
			const refreshToken: RefreshTokenModel = result.rows[0];
			return refreshToken;
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}
}

