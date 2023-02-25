import {Response, Request} from "express";

/** Ping method for testing.
 * @method ping
 * @param req {Request} - request
 * @param res {Response} - response
 */
export const ping = (req: Request, res: Response): void => {
	res.status(200).send('pong')
}
