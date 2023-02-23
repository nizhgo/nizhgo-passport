import bcrypt from "bcryptjs";


export class PasswordService {
	public static createSalt(): string {
		return bcrypt.genSaltSync(14);
	}

	public static hashPassword(password: string, salt: string): string {
		return bcrypt.hashSync(password, salt);
	}

	public static async checkPassword(password: string, passwordHash: string): Promise<boolean> {
		return bcrypt.compareSync(password, passwordHash);

	}
}

