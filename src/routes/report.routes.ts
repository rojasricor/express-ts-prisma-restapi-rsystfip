import { Router } from "express";
import * as reportCtrl from "../controllers/report.controller";

const router = Router();

router.route("/").get(reportCtrl.getReports);
router.route("/count").get(reportCtrl.getReportCount);
router.route("/counts").get(reportCtrl.getReportCounts);

export default router;
