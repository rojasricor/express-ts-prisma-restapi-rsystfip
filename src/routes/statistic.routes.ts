import { Router } from "express";
import * as statisticCtrl from "../controllers/statistic.controller";

const router = Router();

router.route("/:status").get(statisticCtrl.getStatistics);
router.route("/onrange/:status").get(statisticCtrl.getMostAgendatedOnRange);
router.route("/alltime/:status").get(statisticCtrl.getMostAgendatedAllTime);

export default router;
