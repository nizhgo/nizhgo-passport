import {Request, Response, NextFunction} from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //TODO request to auth-service

}

export default authMiddleware