import { Request, Response } from "express";
import * as Statistic from "../models/Statistic";
import { statisticfilterSchema, statusSchema } from "../validation/joi";

export async function getStatistics(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = statisticfilterSchema.validate({
        ...req.params,
        ...req.query,
    });
    if (error)
        return res.status(400).json({ errors: { error: error.message } });

    const statistics = await Statistic.getStatistics(
        value.status,
        value.start,
        value.end
    );
    if (!statistics)
        return res
            .status(400)
            .json({ errors: { error: "Error getting statistics" } });

    return res.status(200).json(statistics);
}

export async function getMostAgendatedOnRange(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = statisticfilterSchema.validate({
        ...req.params,
        ...req.query,
    });
    if (error)
        return res.status(400).json({ errors: { error: error.message } });

    const statistics = await Statistic.getMostAgendatedOnRange(
        value.status,
        value.start,
        value.end
    );
    if (!statistics)
        return res
            .status(400)
            .json({ errors: { error: "Error getting statistics" } });

    return res.status(200).json(statistics);
}

export async function getMostAgendatedAllTime(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = statusSchema.validate(req.params);
    if (error)
        return res.status(400).json({ errors: { error: error.message } });

    const statistics = await Statistic.getMostAgendatedAllTime(value.status);
    if (!statistics)
        return res
            .status(400)
            .json({ errors: { error: "Error getting statistics" } });

    return res.status(200).json(statistics);
}
