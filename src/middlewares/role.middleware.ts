import { Request, Response, NextFunction } from "express";
import { IPayload } from "../interfaces/IPayload";

export default function watchRole(...roles: string[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (roles.includes((req.payloadUser as IPayload).role)) return next();

        return res.status(401).json({ error: "Access denied" });
    };
}
