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

