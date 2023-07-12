import { getReportCount } from "./models/Report";
import { prisma } from "./db.prisma";
import * as ReportService from "./services/Report.service";

async function main() {
    console.clear();

    const reports1 = await getReportCount(
        "2020-07-12 15:39:01",
        "2024-07-12 15:39:01"
    );
    console.log(reports1);

    const reports2 = await ReportService.getReportCount(
        new Date("2020-07-12 15:39:01"),
        new Date("2024-07-12 15:39:01")
    );
    console.log(reports2);
}

main()
    .catch(() => console.error)
    .finally(() => {
        prisma.$disconnect();
        process.exit(0);
    });
