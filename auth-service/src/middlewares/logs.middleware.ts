import logger from "../utils/logger";

export const logsMiddleware = (req, res, next) => {
	const start = Date.now();
	res.on('finish', () => {
		const end = Date.now();
		const responseTime = end - start;
		const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`;

		logger.info({
			message,
			request: {
				method: req.method,
				url: req.originalUrl,
				headers: req.headers,
				body: req.body
			},
			response: {
				statusCode: res.statusCode,
				headers: res.getHeaders(),
				body: res.body
			}
		});
	});

	next();
}

