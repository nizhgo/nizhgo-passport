export interface UserModel {
	id: string;
	username: string;
	email: string;
	passwordHash: string;
	salt: string;
	createdAt: Date;
	updatedAt: Date;
	isDisabled: boolean;
}

