import { CancelledAppointments } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function createCancelledAppointment(
    cancelledAppointment: CancelledAppointments
) {
    try {
        const cancelledAppointmentCreated =
            await prisma.cancelledAppointments.create({
                data: cancelledAppointment,
            });
        return cancelledAppointmentCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
