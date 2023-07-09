import { OkPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { IPeople } from "../interfaces/IPeople";

export async function getLastPerson(): Promise<IPeople | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT id FROM people ORDER BY id DESC LIMIT 1"
    );
    return rows[0] as IPeople;
}

export async function createPerson(person: IPeople): Promise<IPeople | null> {
    const conn = connect();
    if (!conn) return null;
    const [result] = await conn.query<OkPacket>("INSERT INTO people SET ?", [
        person,
    ]);
    return result.affectedRows > 0 ? { ...person, id: result.insertId } : null;
}

export async function getPerson(id: IPeople["id"]): Promise<IPeople | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT * FROM people WHERE id = ?",
        [id]
    );
    return rows[0] as IPeople;
}

export async function updatePerson(
    id: IPeople["id"],
    person: IPeople
): Promise<IPeople | null> {
    const conn = connect();
    if (!conn) return null;
    const [result] = await conn.query<OkPacket>(
        "UPDATE people SET ? WHERE id = ?",
        [person, id]
    );
    return result.affectedRows > 0 ? { ...person } : null;
}

export async function getPeople(): Promise<IPeople[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT p.id, p.name, d.document AS ty_doc, c.category, p.facultie_id, d.description, p.document_number, f.facultie, p.come_asunt FROM people p INNER JOIN documents d ON p.document_id = d.id INNER JOIN faculties f ON p.facultie_id = f.id INNER JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC"
    );
    return rows as IPeople[];
}

export async function getCancelledPeople(): Promise<IPeople[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT p.id, p.name, d.document AS ty_doc, c.category, p.facultie_id, d.description, p.document_number, f.facultie, l.cancelled_asunt FROM people p INNER JOIN documents d ON p.document_id = d.id INNER JOIN faculties f ON p.facultie_id = f.id INNER JOIN categories c ON p.category_id = c.id INNER JOIN cancelled l ON p.id = l.person_id INNER JOIN scheduling s ON s.person_id = l.person_id WHERE s.status = 'cancelled' ORDER BY p.id DESC"
    );
    return rows as IPeople[];
}
