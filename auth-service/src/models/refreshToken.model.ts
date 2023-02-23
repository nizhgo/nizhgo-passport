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
