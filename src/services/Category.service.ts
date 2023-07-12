import { Category } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function getCategories() {
    try {
        const categoriesFound = await prisma.category.findMany();
        return categoriesFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function createManyCategories(
    ...categories: Omit<Category, "id">[]
) {
    try {
        const categoriesCreated = await prisma.category.createMany({
            data: categories,
        });
        return categoriesCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
