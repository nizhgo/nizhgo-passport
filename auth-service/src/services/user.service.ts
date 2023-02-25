import {UserModel} from "../models/user.model";

export class UserService {
	/** Transform user object from database to UserModel
	 *
	 * @param user - user object from database
	 * @returns {UserModel || null} object with all fields from database or null if error
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
			return null;
		}
	}
}
