import { Request, Response } from "express";
import * as sgMail from "../helpers/sg.helper";
import { IScheduleData } from "../interfaces/IScheduleData";
import * as Schedule from "../models/Schedule";
import { cancellSchema, scheduleSchema } from "../validation/schemas";

export async function getSchedule(
    req: Request,
    res: Response
): Promise<Response> {
    const schedules = await Schedule.getSchedules();
    if (!schedules)
        return res.status(500).json({ error: "Error getting schedules" });

    return res.status(200).json(schedules);
}

export async function createSchedule(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = scheduleSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const scheduleCreated = await Schedule.createSchedule(
        value as IScheduleData
    );
    if (!scheduleCreated)
        return res.status(500).json({ error: "Error creating schedule" });

    return res.status(201).json(scheduleCreated);
}

export async function cancellSchedule(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = cancellSchema.validate({
        ...req.params,
        ...req.body,
    });
    if (error) return res.status(400).json({ error: error.message });

    const scheduleFound = await Schedule.getSchedule(value.id);
    if (!scheduleFound)
        return res.status(404).json({ error: "Schedule not found" });

    if (scheduleFound.status === "cancelled")
        return res.status(400).json({ error: "Schedule already cancelled" });

    const newScheduleCancelled: IScheduleData = { status: "cancelled" };
    const scheduleCancelled = await Schedule.updateSchedule(
        newScheduleCancelled,
        scheduleFound.person_id,
        scheduleFound.start_date
    );
    if (!scheduleCancelled)
        return res.status(500).json({ error: "Schedule not cancelled" });

    const msg = `<strong>${scheduleFound.name}</strong>, your schedule cite for the day <code>${scheduleFound.start_date} has been cancelled.
        The reason of cancellation is: <code>${value.cancelled_asunt}</code>.</br><img src='https://repositorio.itfip.edu.co/themes/Mirage2/images/logo_wh.png'>`;

    const msgSended = await sgMail.sendEmail(
        scheduleFound.email as string,
        "Schedule cancelled",
        msg
    );
    if (!msgSended?.response)
        return res
            .status(500)
            .json({ error: "Error reporting the cancellation" });

    return res.status(200).json(scheduleCancelled);
}
