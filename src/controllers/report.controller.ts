import { Request, Response } from "express";
import * as Report from "../models/Report";
import { filterSchema } from "../validation/joi";

export async function getReports(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = filterSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message });

    const reports = await Report.getReports(value.start, value.end);
    if (!reports)
        return res.status(400).json({ error: "Error getting reports" });

    return res.status(200).json(reports);
}

export async function getReportCount(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = filterSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message });

    const count = await Report.getReportCount(value.start, value.end);
    if (!count)
        return res.status(400).json({ error: "Error getting report count" });

    return res.status(200).json(count);
}

export async function getReportCounts(
    req: Request,
    res: Response
): Promise<Response> {
    const counts = await Report.getReportCounts();
    if (!counts)
        return res.status(400).json({ error: "Error getting report counts" });

    return res.status(200).json(counts);
}
