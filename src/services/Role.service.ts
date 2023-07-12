import { Role } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function createManyRoles(...roles: Omit<Role, "id">[]) {
    try {
        const roleCreated = await prisma.role.createMany({
            data: roles,
        });
        return roleCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
