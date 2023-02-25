/** User model
 * @property {string} uid - User UID
 * @property {string} username - User username
 * @property {string} email - User email
 * @property {string} password_hash - User password hash
 * @property {string} salt - User salt
 * @property {Date} createdAt - Date when user was created
 * @property {Date} updatedAt - Date when user was updated
 * @property {boolean} isDisabled - Is user disabled
 * @property {string} disable_reason - Reason why user was disabled
 * @property {Date} last_login_at - Date when user was last logged in
 */

export interface UserModel {
	uid: string;
	username: string;
	email: string;
	password_hash: string;
	salt: string;
	createdAt: Date;
	updatedAt: Date;
	isDisabled: boolean;
}

