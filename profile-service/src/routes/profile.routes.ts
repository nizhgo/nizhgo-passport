import {Response, Reqest, Router} from "express";

const router = new Router();


router.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

export default router;

