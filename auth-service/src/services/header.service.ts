import {Request} from "express";
import useragent from 'useragent';

export class HeaderService {
	public static getAuthorizationHeader(req: Request): string {
		return req.headers.authorization;
	}


	public static getAccessToken(req: Request): string {
		try {
			const authHeader = HeaderService.getAuthorizationHeader(req);
			return authHeader.split(" ")[1];
		}
		catch (err) {
			throw new Error('Invalid access token');
		}
	}

	public static getUserAgent(req: Request): string {
		const agent = useragent.parse(req.headers['user-agent']);
		return agent.toAgent();
	}

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

	public static getBrowser(req: Request): string {
		try {
			const agent = useragent.parse(req.headers['user-agent']);
			return agent.toAgent().split(' ')[0];
		}
		catch (err) {
			return 'Unknown';
		}
	}

	public static getIp(req: Request): string {
		try {
			return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		}
		catch (err) {
			return 'Unknown';
		}
	}

	public static getLanguage(req: Request): string {
		try {
			return req.headers['accept-language'];
		}
		catch (err) {
			return 'Unknown';
		}
	}

	public static getRefreshTokenFromCookie(req: Request): string {
		try {
			return req.cookies.refreshToken;
		}
		catch (err) {
			return null;
		}
	}
}
