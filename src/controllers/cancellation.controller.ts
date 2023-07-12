import { Request, Response } from "express";
import { cancellationSchema } from "../validation/schemas";
import * as CancelledAppointmentService from "../services/CancelledAppointments.service";

export async function createCancellation(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = cancellationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const cancellationCreated =
        await CancelledAppointmentService.createCancelledAppointment(value);
    if (!cancellationCreated)
        return res.status(500).json({ error: "Error creating cancellation" });

    return res
        .status(200)
        .json({ ok: "Schedule cancelled successfully", cancellationCreated });
}
