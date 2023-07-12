import { Document } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function getDocuments() {
    try {
        const documentsFound = await prisma.document.findMany();
        return documentsFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function createManyDocuments(
    ...documents: Omit<Document, "id">[]
) {
    try {
        const documentsFound = await prisma.document.createMany({
            data: documents,
        });
        return documentsFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
