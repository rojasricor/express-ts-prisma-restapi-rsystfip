import { Request, Response } from "express";
import { IPeople } from "../interfaces/IPeople";
import { IScheduleData } from "../interfaces/IScheduleData";
import * as People from "../models/People";
import * as Schedule from "../models/Schedule";
import { idSchema, peopleEditSchema, schedulerSchema } from "../validation/joi";

export async function createPerson(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = schedulerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const newPerson: IPeople = {
        name: value.name,
        document_id: value.doctype,
        document_number: value.doc,
        category_id: value.person,
        telephone: value.telContact,
        email: value.emailContact,
        facultie_id: value.facultie,
        come_asunt: value.asunt,
    };
    const personCreated = await People.createPerson(newPerson);
    if (!personCreated)
        return res.status(500).json({ error: "Error creating person" });

    return res.status(201).json({
        ok: "Person created successfully",
        personCreated: { ...personCreated },
    });
}

export async function getPerson(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message });

    const personFound = await People.getPerson(value.id);
    if (!personFound)
        return res.status(404).json({ error: "Person not found" });

    return res.status(200).json(personFound);
}

export async function updatePerson(
    req: Request,
    res: Response
): Promise<Response> {
    const { error, value } = peopleEditSchema.validate({
        ...req.params,
        ...req.body,
    });
    if (error) return res.status(400).json({ error: error.message });

    const personFound = await People.getPerson(value.id);
    if (!personFound)
        return res.status(404).json({ error: "Person not found" });

    const dataPerson: IPeople = {
        name: value.name,
        document_id: value.doctype,
        document_number: value.doc,
        category_id: value.person,
        facultie_id: value.facultie,
        come_asunt: value.asunt,
    };
    const peopleEdited = await People.updatePerson(value.id, dataPerson);
    if (!peopleEdited)
        return res.status(500).json({ error: "None person updated" });

    return res
        .status(200)
        .json({ ok: "Person updated successfully", peopleEdited });
}

export async function getPeople(
    req: Request,
    res: Response
): Promise<Response> {
    const people = await People.getPeople();
    if (!people) return res.status(500).json({ error: "Error getting people" });

    return res.status(200).json(people);
}

export async function getCancelledPeople(
    req: Request,
    res: Response
): Promise<Response> {
    const peopleCancelled = await People.getCancelledPeople();
    if (!peopleCancelled)
        return res
            .status(500)
            .json({ error: "Error getting cancelled people" });

    return res.status(200).json(peopleCancelled);
}
