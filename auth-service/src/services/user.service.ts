import {UserModel} from "../models/user.model";

export class UserService {
	/** Transform user object from database to UserModel
	 *
	 * @param user - user object from database
	 * @returns UserModel object with all fields from database
	 * @throws Error if user is undefined or null
	 */
	public static mapUser(user: any): UserModel {
		try {
			return {
				uid: user.uid,
				username: user.username,
				email: user.email,
				password_hash: user.password_hash,
				salt: user.salt,
				createdAt: user.created_at,
				updatedAt: user.updated_at,
				isDisabled: user.is_disabled
			}
		}
		catch (err) {
			throw new Error(err.message);
		}
	}
}
