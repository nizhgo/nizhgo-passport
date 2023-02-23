import {
	Request,
	Response
} from 'express';
import {UsersRepository} from "../repositories/user.repository";
import {PasswordService} from "../services/password.service";

export default class PasswordController {
	public static async changePassword(req: Request, res: Response): Promise<void> {
		try {
			const {userId} = req.params;
			const {oldPassword, newPassword} = req.body;

			// Check if old password matches the one in the database
			const user = await UsersRepository.getUserByUid(userId);
			const isMatch = await PasswordService.checkPassword(oldPassword, user.password_hash);
			if (!isMatch) {
				return res.status(400).json({message: 'Old password does not match'});
			}

			// Generate a new salt and hash the new password
			const salt = PasswordService.createSalt();
			const passwordHash = PasswordService.hashPassword(newPassword, salt);

			// Update the user's password in the database
			const result = await UsersRepository.updateUserPassword(userId, passwordHash, salt);
			if (result) {
				return res.status(200).json({message: 'Password updated successfully'});
			}
			else {
				return res.status(500).json({message: 'Password update failed, please try again later'});
			}
		}
		catch (err) {
			console.error(err);
			return res.status(500).json({message: 'Password update failed, please try again later'});
		}
	}
}
