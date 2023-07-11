import { Request, Response } from "express";
import { IDean } from "../interfaces/IDean";
import * as Dean from "../models/Dean";
import { deanSchema } from "../validation/schemas";

export async function getDeans(req: Request, res: Response): Promise<Response> {
    const deans = await Dean.getDeans();
    if (!deans) return res.status(500).json({ error: "Error getting deans" });

    return res.status(200).json(deans);
}

export async function createDean(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = deanSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const deanFound = await Dean.getDean(value._id);
    if (deanFound)
        return res.status(409).json({ error: "Dean already exists" });

    const deanCreated = await Dean.createDean(value as IDean);
    if (!deanCreated)
        return res.status(500).json({ error: "Error creating dean" });

    return res.status(201).json(deanCreated);
}
