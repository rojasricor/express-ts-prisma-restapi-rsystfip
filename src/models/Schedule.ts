import { OkPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { ICalendar } from "../interfaces/ICalendar";
import { IPeople } from "../interfaces/IPeople";
import { IScheduleData } from "../interfaces/IScheduleData";

export async function createSchedule(
    scheduleData: IScheduleData
): Promise<IScheduleData | null> {
    const conn = connect();
    if (!conn) return null;
    const [result] = await conn.query<OkPacket>(
        "INSERT INTO scheduling SET ?",
        [scheduleData]
    );
    return result.affectedRows > 0 ? { ...scheduleData } : null;
}

export async function getSchedule(
    id: IScheduleData["person_id"]
): Promise<(IScheduleData & IPeople) | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT s.person_id, p.name, p.telephone AS tel, p.email, s.start_date, s.status FROM scheduling s INNER JOIN people p ON p.id = s.person_id WHERE s.person_id = ?",
        [id]
    );
    return rows[0] as IScheduleData & IPeople;
}

export async function getSchedules(): Promise<ICalendar[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT s.person_id AS id, p.name AS title, s.start_date AS start, s.end_date AS end, s.color FROM scheduling s INNER JOIN people p ON p.id = s.person_id WHERE s.status = 'scheduled'"
    );
    return rows as ICalendar[];
}

export async function updateSchedule(
    cancellation: IScheduleData,
    person_id: IScheduleData["person_id"],
    start_date: IScheduleData["start_date"]
): Promise<IScheduleData | null> {
    const conn = connect();
    if (!conn) return null;
    const [result] = await conn.query<OkPacket>(
        "UPDATE scheduling SET ? WHERE person_id = ? AND start_date = ?",
        [cancellation, person_id, start_date]
    );
    return result.affectedRows > 0 ? { ...cancellation } : null;
}
