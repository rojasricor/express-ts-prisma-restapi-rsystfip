import { People } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function createPerson(person: Omit<People, "id">) {
    try {
        const personCreated = await prisma.people.create({
            data: person,
        });
        return personCreated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getPerson(id: People["id"]) {
    try {
        const personFound = await prisma.people.findUnique({
            where: {
                id,
            },
        });
        return personFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function updatePerson(id: People["id"], person: Partial<People>) {
    try {
        const personUpdated = await prisma.people.update({
            where: {
                id,
            },
            data: person,
        });
        return personUpdated;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getPeople() {
    try {
        const peopleFound = await prisma.people.findMany({
            orderBy: {
                id: "desc",
            },
        });
        return peopleFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

export async function getCancelledPeople() {
    try {
        const peopleFound = await prisma.people.findMany({
            where: {
                Schedule: {
                    some: {
                        stateSchedule: {
                            state: "cancelled",
                        },
                    },
                },
            },
            orderBy: {
                id: "desc",
            },
        });
        return peopleFound;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}
