import { Request, Response } from "express";
import * as Dean from "../models/Dean";

export async function getDeans(req: Request, res: Response): Promise<Response> {
    const deans = await Dean.getDeans();
    if (!deans) return res.status(500).json({ error: "Error getting deans" });

    return res.status(200).json(deans);
}
