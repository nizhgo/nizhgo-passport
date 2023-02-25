import winston from 'winston';


/** Logger for requests. Saves to logs/requests.log */
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		// if you want to see the logs in the console, uncomment the line below
		// new winston.transports.Console({
		// 	format: winston.format.combine(
		// 		winston.format.colorize(),
		// 		winston.format.simple()
		// 	)
		// }),
		new winston.transports.File({ filename: 'logs/requests.log' })
	]
});

export default logger;
