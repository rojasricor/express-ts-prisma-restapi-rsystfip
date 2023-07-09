import { ICount } from "interfaces/ICount";
import { RowDataPacket } from "mysql2";
import { connect } from "../db";
import { IScheduleData } from "../interfaces/IScheduleData";
import { IStatistic } from "../interfaces/IStatistic";

export async function getStatistics(
    status: IScheduleData["status"],
    start: IScheduleData["start_date"],
    end: IScheduleData["end_date"]
): Promise<IStatistic[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT SUM(CASE WHEN s.status = ? THEN 1 ELSE 0 END) AS scheduling_count, c.category FROM scheduling s INNER JOIN people p ON p.id = s.person_id INNER JOIN categories c ON c.id = p.category_id WHERE s.start_date >= ? AND s.start_date <= ? GROUP BY p.category_id",
        [status, start, end]
    );
    return rows as IStatistic[];
}

export async function getMostAgendatedOnRange(
    status: IScheduleData["status"],
    start: IScheduleData["start_date"],
    end: IScheduleData["end_date"]
): Promise<ICount[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT c.category, COUNT(*) AS counts FROM scheduling s INNER JOIN people p ON p.id = s.person_id INNER JOIN categories c ON c.id = p.category_id WHERE s.status = ? AND s.date_filter >= ? AND s.date_filter <= ? GROUP BY p.category_id, c.category ORDER BY counts DESC LIMIT 10",
        [status, start, end]
    );
    return rows as ICount[];
}

export async function getMostAgendatedAllTime(
    status: IScheduleData["status"]
): Promise<ICount[] | null> {
    const conn = connect();
    if (!conn) return null;
    const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT c.category, COUNT(*) AS counts FROM scheduling s INNER JOIN people p ON p.id = s.person_id INNER JOIN categories c ON c.id = p.category_id WHERE s.status = ? GROUP BY p.category_id, c.category ORDER BY counts DESC LIMIT 10",
        [status]
    );
    return rows as ICount[];
}
