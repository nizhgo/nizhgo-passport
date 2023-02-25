// Importing required modules
import dotenv from "dotenv";
import {
	NextFunction,
	Request,
	Response
} from "express";
import {UsersRepository} from "../repositories/user.repository";
import {HttpService} from "../services/http.service";
import {TokenService} from "../services/token.service";

// Loading environment variables
dotenv.config();

/**
 * Middleware function to verify user authentication using JWT tokens.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express middleware function.
 * @returns Returns next middleware function if authentication is successful.
 */
export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Extracting access token from request
		const accessToken = HttpService.getAccessToken(req);
		// Verifying access token using token service
		const decodedToken = await TokenService.verifyAccessToken(accessToken);
		// If token is invalid, return error response
		if (!decodedToken) {
			return res.status(401).json({message: 'Invalid access token'});
		}
		// Fetching user details using user repository and user ID from decoded token
		const user = await UsersRepository.findUserByUid(decodedToken.uid);
		// If user is not found or disabled, return error response
		if (!user || user.isDisabled) {
			return res.status(401).json({message: 'User is disabled'});
		}
		// If token has expired, return error response
		if (decodedToken.exp < Date.now()) {
			return res.status(401).json({message: 'Token expired'});
		}
	}
	catch (err) {
		// If any other error occurs, return error response
		return res.status(403).json({message: err.message});
	}
	// If authentication is successful, call next middleware function
	next();
};
