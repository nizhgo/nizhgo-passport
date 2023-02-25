/** interface for the token payload
 * @interface TokenPayload
 * @property {string} uid - user uid
 * @property {string} username - user username
 * @property {number} exp - expiration time
 */
export interface TokenPayload {
	uid: string;
	username: string;
	exp: number;
}

