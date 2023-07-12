import { Schedule } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function createSchedule(schedule: Schedule) {
    try {
        const scheduleCreated = await prisma.schedule.create({
            data: schedule,
        });
        return scheduleCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getSchedule(person_id: Schedule["person_id"]) {
    try {
        const scheduleFound = await prisma.schedule.findFirst({
            where: {
                person_id,
            },
            include: {
                stateSchedule: true,
                person: true,
            },
        });
        return scheduleFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getSchedules() {
    try {
        const schedulesFound = await prisma.schedule.findMany({
            where: {
                stateSchedule: {
                    state: "scheduled",
                },
            },
        });
        return schedulesFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateSchedule(
    schedule: Partial<Schedule>,
    person_id: Schedule["person_id"],
    start_date: Schedule["start_date"]
) {
    try {
        const scheduleUpdated = await prisma.schedule.updateMany({
            where: {
                person_id,
                start_date,
            },
            data: schedule,
        });
        return scheduleUpdated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
