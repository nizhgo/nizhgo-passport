import { Request, Response, NextFunction } from 'express';

/** Catch all unhandled errors and return a 500 response
 * @param err {Error} - The error object
 * @param req {Request} - The request object
 * @param res {Response} - The response object
 * @param next {NextFunction} - The next middleware function
 * @description This middleware catches all unhandled errors and returns a 500 response with a generic error message. Save server from crashing.
 * @returns {void}
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}
