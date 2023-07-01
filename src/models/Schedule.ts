import { OkPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { IPeople } from "../interfaces/database/IPeople";
import { IScheduleData } from "../interfaces/database/IScheduleData";

export async function createSchedule(
  scheduleData: IScheduleData
): Promise<IScheduleData | null> {
  const conn = connect();
  if (!conn) return null;
  const [result] = (await conn.query("INSERT INTO scheduling SET ?", [
    scheduleData,
  ])) as OkPacket[];
  return result.affectedRows > 0 ? { ...scheduleData } : null;
}

export async function getSchedule(
  id: IScheduleData["person_id"]
): Promise<(IScheduleData & IPeople) | null> {
  const conn = connect();
  if (!conn) return null;
  const [schedule] = (await conn.query(
    "SELECT s.person_id, p.name, p.telephone AS tel, p.email, s.start_date, s.status FROM scheduling s INNER JOIN people p ON p.id = s.person_id WHERE s.person_id = ?",
    [id]
  )) as RowDataPacket[];
  return schedule[0] as IScheduleData & IPeople;
}

export async function cancellSchedule(
  cancellation: IScheduleData,
  person_id: IScheduleData["person_id"],
  start_date: IScheduleData["start_date"]
): Promise<IScheduleData | null> {
  const conn = connect();
  if (!conn) return null;
  const [result] = (await conn.query(
    "UPDATE scheduling SET ? WHERE person_id = ? AND start_date = ?",
    [cancellation, person_id, start_date]
  )) as OkPacket[];
  return result.affectedRows > 0 ? { ...cancellation } : null;
}
