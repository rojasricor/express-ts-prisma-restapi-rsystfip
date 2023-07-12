import { User } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function getUser(id?: User["id"], email?: User["email"]) {
    try {
        const userFound = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email,
                    },
                    {
                        id,
                    },
                ],
            },
            include: {
                role: true,
            },
        });
        return userFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getUsers() {
    try {
        const usersFound = await prisma.user.findMany();
        return usersFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function createUser(user: User) {
    try {
        const userCreated = await prisma.user.create({
            data: user,
        });
        return userCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteUser(id: User["id"]) {
    try {
        const userDeleted = await prisma.user.delete({
            where: {
                id,
            },
        });
        return userDeleted;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateUser(id: User["id"], user: Partial<User>) {
    try {
        const userUpdated = await prisma.user.update({
            where: {
                id,
            },
            data: user,
        });
        return userUpdated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
