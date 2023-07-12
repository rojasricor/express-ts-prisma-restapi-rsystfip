import { prisma } from "../db.prisma";

export async function getStatisticSchedule() {
    try {
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getMostAgendatedOnRange() {
    try {
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getMostAgendatedAllTime() {
    try {
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
