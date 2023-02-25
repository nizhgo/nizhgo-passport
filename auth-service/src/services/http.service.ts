import {
	Request,
	Response
} from "express";
import useragent from 'useragent';
import {tokenSettings} from "./token.service";

export class HttpService {

	/** Get authorization header from request object
	 * @param req Request object from express library
	 * @returns {string} Authorization header
	 */
	public static getAuthorizationHeader(req: Request): string {
		return req.headers.authorization;
	}


	/** Get access token from request object
	 * @param req Request object from express library
	 * @returns {string} Access token
	 * @throws {Error} If access token is not valid
	 */
	public static getAccessToken(req: Request): string {
		try {
			const authHeader = HttpService.getAuthorizationHeader(req);
			return authHeader.split(" ")[1];
		}
		catch (err) {
			throw new Error('Invalid access token');
		}
	}

	/** Get user agent string from request object
	 * @param req Request object from express library
	 * @returns {string} User agent string
	 */
	public static getUserAgent(req: Request): string {
		const agent = useragent.parse(req.headers['user-agent']);
		return agent.toAgent();
	}

	/** Get device name from user agent string (e.g. iPhone, iPad, Samsung Galaxy, etc.).
	 * @param req Request object from express library
	 * @returns {string} Device name or 'Unknown' if device name is not found in user agent string or user agent string
	 *     is not valid
	 */
	public static getDevice(req: Request): string {
		try {
			const agent = useragent.parse(req.headers['user-agent']);
			return agent.device.family;
			//return agent.os.toAgent().split(' ')[0];
		}
		catch (err) {
			return 'Unknown';
		}
	}

	/** Get browser name from user agent string without version (e.g. Chrome, Firefox, Safari, etc.).
	 * @param req Request object from express library
	 * @returns {string} Browser name or 'Unknown' if browser name is not found in user agent string or user agent
	 *     string is not valid
	 */
	public static getBrowser(req: Request): string {
		try {
			const agent = this.getUserAgent(req);
			return agent.split(' ')[0];
		}
		catch (err) {
			return 'Unknown';
		}
	}

	/** Get refresh token from HttpOnly cookie
	 * @param req Request object from express library
	 * @returns {string} Refresh token or null if cookie is not found
	 * @throws {Error} If cookie is not valid
	 */
	public static getRefreshTokenFromCookie(req: Request): string {
		try {
			return req.cookies.refreshToken;
		}
		catch (err) {
			throw new Error('Invalid refresh token');
		}
	}

	/**
	 * Set refresh token secure HttpOnly cookie with expiration date like in token payload (exp) field  (in seconds)
	 * @param res
	 * @param token
	 */
	public static setRefreshTokenCookie(res: Response, token: string): void {
		return res.cookie('refreshToken', token, {
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: tokenSettings.refreshToken.expiresIn,
		});
	}
}
