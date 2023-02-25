/** Refresh Token Model
 * @property {string} id - Refresh token ID
 * @property {string} user_uid - User UID
 * @property {string} token - Refresh token
 * @property {Date} created_at - Date when refresh token was created
 * @property {Date} disabled_at - Date when refresh token was disabled
 * @property {string} browser - Browser name
 * @property {string} device - Device name
 * @property {boolean} isDisabled - Is refresh token disabled
 * @property {string} disable_reason - Reason why refresh token was disabled
 * @property {Date} last_used_at - Date when refresh token was last used
 */

export interface RefreshTokenModel {
	id?: string;
	user_uid: string;
	token: string;
	created_at: Date;
	disabled_at?: Date;
	browser: string;
	device: string;
	isDisabled: boolean;
	disable_reason?: string;
	last_used_at: Date;
}
