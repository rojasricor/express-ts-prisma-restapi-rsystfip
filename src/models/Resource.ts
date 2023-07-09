import { IDocument } from "interfaces/IDocument";
import { IFaculty } from "interfaces/IFaculty";
import { RowDataPacket } from "mysql2";
import { connect } from "../db";
import { ICategory } from "../interfaces/ICategory";

export async function getCategories(): Promise<ICategory[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT id, category FROM categories"
    );
    return rows as ICategory[];
}

export async function getDocuments(): Promise<IDocument[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT id, description FROM documents"
    );
    return rows as IDocument[];
}

export async function getFaculties(): Promise<IFaculty[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT id, facultie FROM faculties"
    );
    return rows as IFaculty[];
}
