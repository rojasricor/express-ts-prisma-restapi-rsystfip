import { OkPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { IDean } from "../interfaces/IDean";

export async function getDean(_id: IDean["_id"]): Promise<IDean | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT _id FROM deans WHERE _id = ?",
        [_id]
    );
    return rows[0] as IDean;
}

export async function getDeans(): Promise<IDean[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT _id, dean, facultie_id FROM deans"
    );
    return rows as IDean[];
}

export async function createDean(dean: IDean): Promise<IDean | null> {
    const conn = connect();
    if (!conn) return null;
    const [result] = await conn.query<OkPacket>("INSERT INTO deans SET ?", [
        dean,
    ]);
    return result.affectedRows > 0 ? { ...dean } : null;
}
