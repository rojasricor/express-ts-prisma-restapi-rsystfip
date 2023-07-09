import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { IPayload } from "../interfaces/IPayload";

export async function verifyJwtOfSession(
    req: Request,
    res: Response
): Promise<Response> {
    const jwt = req.headers.authorization;
    if (!jwt) return res.status(401).json("Not session provided");

    try {
        const payload = Jwt.verify(jwt, SECRET_KEY || "secretkey") as IPayload;
        return res
            .status(200)
            .json({ ok: { isValid: true, decoded: payload } });
    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }
}
