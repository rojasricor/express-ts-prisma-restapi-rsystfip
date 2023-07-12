import { Schedule } from "@prisma/client";
import { prisma } from "../db.prisma";

export async function getReports(
    start: Schedule["date_filter"],
    end: Schedule["date_filter"]
) {
    const query = `
    SELECT p.name, s.start_date AS date, s.modification AS time, 
      SUM(CASE WHEN s.status = 'scheduled' THEN 1 ELSE 0 END) AS scheduling_count, 
      SUM(CASE WHEN s.status = 'daily' THEN 1 ELSE 0 END) AS daily_count, 
      c.category, c.id AS id_person 
    FROM Schedule s 
    INNER JOIN People p ON p.id = s.person_id 
    INNER JOIN Category c ON c.id = p.category_id 
    WHERE s.date_filter >= ? AND s.date_filter <= ? 
    GROUP BY s.person_id
  ` as unknown as TemplateStringsArray;
    const reports = await prisma.$queryRaw(query, start, end);
    return reports;
}

export async function getReportCount(
    start: Schedule["date_filter"],
    end: Schedule["date_filter"]
) {
    const query = `
    SELECT c.category, COUNT(s.person_id) AS counts
    FROM scheduling s
    INNER JOIN people p ON p.id = s.person_id
    INNER JOIN categories c ON c.id = p.category_id
    WHERE s.date_filter >= ?
    AND s.date_filter <= ?
    GROUP BY p.category_id, c.category
    ORDER BY counts DESC
    LIMIT 10
` as unknown as TemplateStringsArray;
    const reportCount = await prisma.$queryRaw(query, start, end);
    return reportCount;
}

export async function getReportCounts() {
    const query = `
        SELECT c.category, COUNT(s.person_id) AS counts
        FROM scheduling s
        INNER JOIN people p ON p.id = s.person_id
        INNER JOIN categories c ON c.id = p.category_id
        GROUP BY p.category_id, c.category
        ORDER BY counts DESC
        LIMIT 10
    ` as unknown as TemplateStringsArray;
    const reportCounts = await prisma.$queryRaw(query);
    return reportCounts;
}
