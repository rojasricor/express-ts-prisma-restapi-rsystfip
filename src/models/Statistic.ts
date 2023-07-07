import { RowDataPacket } from "mysql2";
import { connect } from "../db";
import { IScheduleData } from "../interfaces/IScheduleData";

export async function getStatistics(
    start: IScheduleData["start_date"],
    end: IScheduleData["end_date"]
): Promise<null> {
    const conn = await connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT p.name, s.start_date AS date, s.modification AS time, SUM(CASE WHEN s.status = 'scheduled' THEN 1 ELSE 0 END) AS scheduling_count, SUM(CASE WHEN s.status = 'daily' THEN 1 ELSE 0 END) AS daily_count, c.category, c.id AS id_person FROM scheduling s INNER JOIN people p ON p.id = s.person_id INNER JOIN categories c ON c.id = p.category_id WHERE s.date_filter >= ? AND s.date_filter <= ? GROUP BY s.person_id",
        [start, end]
    );
    return rows as IReport[];
}
