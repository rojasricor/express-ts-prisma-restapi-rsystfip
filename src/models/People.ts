import { OkPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { IPeople } from "../interfaces/database/IPeople";

export async function getLastPerson(): Promise<IPeople | null> {
  const conn = connect();
  if (!conn) return null;
  const [dean] = (await conn.query(
    "SELECT id FROM people ORDER BY id DESC LIMIT 1"
  )) as RowDataPacket[];
  return dean[0] as IPeople;
}

export async function createPerson(person: IPeople): Promise<IPeople | null> {
  const conn = connect();
  if (!conn) return null;
  const [result] = (await conn.query("INSERT INTO people SET ?", [
    person,
  ])) as OkPacket[];
  return result.affectedRows > 0 ? { ...person, id: result.insertId } : null;
}

export async function getPeople(): Promise<IPeople[] | null> {
  const conn = connect();
  if (!conn) return null;
  const [people] = (await conn.query(
    "SELECT p.id, p.name, d.document AS ty_doc, c.category, p.facultie_id, d.description, p.document_number, f.facultie, p.come_asunt FROM people p INNER JOIN documents d ON p.document_id = d.id INNER JOIN faculties f ON p.facultie_id = f.id INNER JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC"
  )) as RowDataPacket[];
  return people as IPeople[];
}

export async function getPerson(id: IPeople["id"]): Promise<IPeople | null> {
  const conn = connect();
  if (!conn) return null;
  const [people] = (await conn.query("SELECT * FROM people WHERE id = ?", [
    id,
  ])) as RowDataPacket[];
  return people[0] as IPeople;
}

export async function updatePerson(
  id: IPeople["id"],
  person: IPeople
): Promise<IPeople | null> {
  const conn = connect();
  if (!conn) return null;
  const [result] = (await conn.query("UPDATE people SET ? WHERE id = ?", [
    person,
    id,
  ])) as OkPacket[];
  return result.affectedRows > 0 ? { ...person } : null;
}
