import {Request, Response, NextFunction, response} from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //TODO requst to auth-service

}

export default authMiddleware