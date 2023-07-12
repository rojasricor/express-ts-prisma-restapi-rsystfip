import { Faculty } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function getFaculties() {
    try {
        const facultiesFound = await prisma.faculty.findMany();
        return facultiesFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function createManyFaculties(...faculties: Omit<Faculty, "id">[]) {
    try {
        const facultiesCreated = await prisma.faculty.createMany({
            data: faculties,
        });
        return facultiesCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
