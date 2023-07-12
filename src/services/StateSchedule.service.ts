import { prisma } from "../db.prisma";
import { StateSchedule } from "@prisma/client";

export async function createManyStateSchedules(
    ...stateSchedules: Omit<StateSchedule, "id">[]
) {
    try {
        const stateScheduleCreated = prisma.stateSchedule.createMany({
            data: stateSchedules,
        });
        return stateScheduleCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
