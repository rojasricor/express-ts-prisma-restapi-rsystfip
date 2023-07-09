import { OkPacket } from "mysql2";
import { connect } from "../db";
import { ICancelledSchedule } from "../interfaces/ICancelledSchedule";

export async function createCancellation(
    cancellation: ICancelledSchedule
): Promise<ICancelledSchedule | null> {
    const conn = connect();
    if (!conn) return null;
    const [result] = await conn.query<OkPacket>("INSERT INTO cancelled SET ?", [
        cancellation,
    ]);
    return result.affectedRows > 0 ? { ...cancellation } : null;
}
