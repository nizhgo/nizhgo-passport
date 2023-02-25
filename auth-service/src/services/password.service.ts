import bcrypt from "bcryptjs";


export class PasswordService {

	/**
	 * Creates a salt for hashing a password using bcrypt.
	 * @returns {string} the salt
	 */
	public static createSalt(): string {
		return bcrypt.genSaltSync(14);
	}

	/**
	 * Hashes a given password with a given salt using bcrypt.
	 * @param {string} password - the password to be hashed
	 * @param {string} salt - the salt to be used for hashing
	 * @returns {string} the hashed password
	 */
	public static hashPassword(password: string, salt: string): string {
		return bcrypt.hashSync(password, salt);
	}

	/**
	 * Checks whether a given password matches a stored hash.
	 * @param {string} password - the password to check
	 * @param {string} passwordHash - the stored hash to compare the password against
	 * @returns {Promise<boolean>} whether the password matches the stored hash
	 */
	public static async checkPassword(password: string, passwordHash: string): Promise<boolean> {
		return bcrypt.compareSync(password, passwordHash);
	}

}

