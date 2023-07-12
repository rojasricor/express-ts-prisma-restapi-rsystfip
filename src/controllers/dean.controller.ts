import { Request, Response } from "express";
import { deanSchema } from "../validation/schemas";
import * as DeanService from "../services/Dean.service";

export async function getDeans(req: Request, res: Response): Promise<Response> {
    const deans = await DeanService.getDeans();
    if (!deans) return res.status(500).json({ error: "Error getting deans" });

    return res.status(200).json(deans);
}

export async function createDean(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = deanSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const deanFound = await DeanService.getDean(value._id);
    if (deanFound)
        return res.status(409).json({ error: "Dean already exists" });

    const deanCreated = await DeanService.createDean({
        id: value.id,
        dean: value.dean,
        faculty_id: value.faculty_id,
    });
    if (!deanCreated)
        return res.status(500).json({ error: "Error creating dean" });

    return res.status(201).json(deanCreated);
}
