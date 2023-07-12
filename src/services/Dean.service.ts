import { Dean } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function getDean(id: Dean["id"]) {
    try {
        const deanFound = await prisma.dean.findUnique({ where: { id } });
        return deanFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getDeans() {
    try {
        const deansFound = await prisma.dean.findMany();
        return deansFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function createDean(dean: Dean) {
    try {
        const deanCreated = await prisma.dean.create({
            data: dean,
        });
        return deanCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
