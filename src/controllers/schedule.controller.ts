import { Request, Response } from "express";
import * as sgMail from "../helpers/sgMail";
import { ICancelledSchedule } from "../interfaces/ICancelledSchedule";
import { IScheduleData } from "../interfaces/IScheduleData";
import * as Cancellation from "../models/Cancellation";
import * as Schedule from "../models/Schedule";
import { cancellSchema } from "../validation/joi";

export async function getSchedule(
    req: Request,
    res: Response
): Promise<Response> {
    const schedules = await Schedule.getSchedule();
    if (!schedules)
        return res.status(500).json({ error: "Error getting schedules" });

    return res.status(200).json(schedules);
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

    const scheduleFound = await Schedule.getOneSchedule(value.id);
    if (!scheduleFound)
        return res.status(404).json({ error: "Schedule not found" });

    if (scheduleFound.status === "cancelled")
        return res.status(400).json({ error: "Schedule already cancelled" });

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

    const newScheduleCancelled: IScheduleData = { status: "cancelled" };
    const scheduleCancelled = await Schedule.updateSchedule(
        newScheduleCancelled,
        scheduleFound.person_id,
        scheduleFound.start_date
    );
    if (!scheduleCancelled)
        return res.status(500).json({ error: "Schedule not cancelled" });

    const newCancellation: ICancelledSchedule = {
        cancelled_asunt: value.cancelled_asunt,
        person_id: scheduleFound.person_id as number,
    };
    const cancellation = await Cancellation.createCancellation(newCancellation);
    if (!cancellation)
        return res.status(500).json({ error: "Error cancelling schedule" });

    return res.status(200).json({
        ok: "Schedule cancelled successfully",
        scheduleCancelled: { ...cancellation, ...scheduleCancelled },
    });
}
