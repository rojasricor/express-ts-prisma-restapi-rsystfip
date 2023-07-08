import { Request, Response, NextFunction } from "express";
import { IPayload } from "../interfaces/IPayload";

function watchRole(
    req: Request,
    res: Response,
    next: NextFunction
): Response | void {
    // console.log(req.payloadUser as IPayload);
    next();
}

export default () => watchRole;
