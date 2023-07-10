import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { IPayload } from "../interfaces/IPayload";

export default function validateAuth() {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        const jwt = req.headers.authorization;
        if (!jwt) return res.status(401).json("Not session provided");

        try {
            const payload = Jwt.verify(
                jwt,
                SECRET_KEY || "secretkey"
            ) as IPayload;
            req.payloadUser = payload;
            return next();
        } catch (error: any) {
            return res.status(401).json({ error: error.message });
        }
    };
}
